import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberMaterialService } from './membermaterial.service';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepo: Repository<Member>,

    private readonly mmService: MemberMaterialService,
  ) {}

  async create(createMemberDto: CreateMemberDto) {
    try {
      const member = await this.memberRepo.save(createMemberDto);
      return member;
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(job_id: number, paquete_id: number) {
    let members: Member[];

    try {
      members = await this.memberRepo.find({
        where: {
          paquete: { _id: paquete_id, job: { _id: job_id } },
        },
        relations: {
          paquete: { job: true },
          member_material: { material: true },
        },
      });
    } catch {
      throw new BadRequestException('Invalid paquete id');
    }

    return await Promise.all(
      members.map(async (member) => {
        const weight = await this.mmService.getWeight(member._id);
        return {
          _id: member._id,
          barcode: member.barcode,
          piecemark: member.piecemark,
          mem_desc: `${member.mem_desc} ${member.main_material}`,
          quantity: member.quantity,
          weight: Math.round(weight),
          materials: member.member_material.map((mat) => {
            return {
              quantity: mat.quantity,
              // cutted: mat.cutted,
              ...mat.material,
            };
          }),
        };
      }),
    );
  }

  async findOne(jobid: number, _id: number) {
    const member = await this.memberRepo.findOne({
      where: { _id, paquete: { job: { _id: jobid } } },
      relations: { member_material: { material: true }, paquete: true },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const weight = await this.mmService.getWeight(member._id);
    return {
      _id: member._id,
      barcode: member.barcode,
      piecemark: member.piecemark,
      mem_desc: `${member.mem_desc} ${member.main_material}`,
      quantity: member.quantity,
      weight: Math.round(weight),
      materials: member.member_material.map((mat) => {
        return {
          quantity: mat.quantity,
          // cutted: mat.cutted,
          ...mat.material,
        };
      }),
    };
  }

  async findOneBy(piecemark: string, paqueteId: number): Promise<Member> {
    return await this.memberRepo.findOne({
      where: { piecemark, paquete: { _id: paqueteId } },
      relations: ['paquete'],
    });
  }

  async getBarcode(paquete_id: number) {
    const barcodes = await this.memberRepo.find({
      where: { paquete: { _id: paquete_id } },
      relations: { paquete: true },
      select: ['barcode'],
    });

    return barcodes.map((result) => result.barcode);
  }

  async memberNotYetAssignedToTeam(paquete_id: number) {
    return await this.memberRepo
      .createQueryBuilder('member')
      .leftJoin('member.tasks', 'task')
      .leftJoin('member.paquete', 'paquete')
      .select('member._id', 'member_id')
      .addSelect(
        'CONCAT(member.mem_desc, " ", member.main_material)',
        'details',
      )
      .addSelect('member.piecemark', 'piecemark')
      .addSelect('member.quantity', 'total')
      .addSelect(
        'COALESCE(member.quantity - SUM(task.quantity), member.quantity)',
        'pending',
      )
      .where('member.paquete_id = :paquete_id', { paquete_id })
      .groupBy('member._id')
      .having('COALESCE(SUM(task.quantity), 0) < member.quantity')
      .getRawMany();
  }

  async availableForArea(areaId: number, job_id: number, paqueteId: number) {
    const data = await this.findAll(job_id, paqueteId);

    // const members = data.filter((member) =>
    //   member.materials.every(
    //     (material) => material.cutted === material.quantity,
    //   ),
    // );

    return data;
  }

  async fullyCutMembers() {
    const members = await this.memberRepo.find({
      // where: { _id: 137 },
      relations: {
        member_material: true,
        tasks: { items: true },
      },
    });

    const groupCutted = members.map((member) => {
      const materials = member.member_material.map((mm, index) => {
        return {
          //...mm.material,
          quantity: mm.quantity,
          cutted: member.tasks.reduce(
            (acc, task) => (acc += task.items[index].cutted),
            0,
          ),
        };
      });

      return {
        _id: member._id,
        piecemark: member.piecemark,
        barcode: member.barcode,
        mem_desc: `${member.mem_desc} ${member.main_material}`,
        quantity: member.quantity,
        materials,
      };
    });
    //return members;
    return groupCutted
      .map((member) => {
        let count = 0;
        let done = false;
        for (let icount = 1; icount <= member.quantity; icount++) {
          for (let index = 1; index < member.materials.length + 1; index++) {
            const cutted_ = member.materials[index - 1].cutted;
            const qt = member.materials[index - 1].quantity * icount;
            if (qt > cutted_) {
              count = icount - 1;
              done = true;
              break;
            }
          }
          if (done) break;
        }
        return {
          _id: member._id,
          piecemark: member.piecemark,
          barcode: member.barcode,
          mem_desc: member.mem_desc,
          count,
        };
      })
      .filter((mm) => mm.count > 0);
  }

  updateByCode(barcode: string, updateMemberDto: UpdateMemberDto) {
    this.memberRepo.update({ barcode }, { ...updateMemberDto });
  }
}
