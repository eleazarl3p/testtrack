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
import { MemberAreaService } from './member-area.service';
import { MemberToAreaDto } from './dto/member-to-area.dto';
import { MemberMaterial } from './entities/membermaterial.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepo: Repository<Member>,

    private readonly mmService: MemberMaterialService,

    private readonly maService: MemberAreaService,

    //private readonly weldingService: WeldingService,
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
          tasks: { items: { material: true } },
          member_area: { area: true, user: true },
        },
        order: {
          tasks: { items: { last_update: 'asc' } },
          member_area: { created_at: 'asc' },
        },
      });
    } catch {
      throw new BadRequestException('Invalid paquete id');
    }

    return await Promise.all(
      members.map(async (member) => {
        const weight = await this.mmService.getWeight(member._id);
        const groupedMaterials = member.member_material.reduce(
          (acc, mm) => {
            if (!acc[mm.material.piecemark]) {
              acc[mm.material.piecemark] = {
                ...mm.material,
                quantity: 0,
                cutted: 0,
              };
            }
            acc[mm.material.piecemark].quantity += mm.quantity;
            return acc;
          },
          {} as Record<string, any>,
        );

        if (member.tasks.length) {
          for (const task of member.tasks) {
            for (const item of task.items) {
              const piecemark = item.material.piecemark;
              if (groupedMaterials[piecemark]) {
                groupedMaterials[piecemark].cutted += item.cutted;
                groupedMaterials[piecemark]['last_update'] = item.last_update;
              }
            }
          }
        }

        member.member_material = Object.values(groupedMaterials);
        const newMember = {
          _id: member._id,
          barcode: member.barcode,
          piecemark: member.piecemark,
          mem_desc: `${member.mem_desc} ${member.main_material}`,
          quantity: member.quantity,
          weight: Math.round(weight),
          materials: member.member_material,
          areas: member.member_area.map((area) => {
            return {
              ...area,
              user: area.user.fullname(),
            };
          }),
        };

        const ma = newMember.areas.reduce(
          (acc, ma) => {
            if (!acc[ma.area._id]) {
              acc[ma.area._id] = {
                ...ma,
                quantity: 0,
              };
            }

            acc[ma.area._id].quantity += ma.quantity;
            acc[ma.area._id].created_at = ma.created_at;

            return acc;
          },
          {} as Record<number, any>,
        );
        newMember.areas = Object.values(ma);
        return newMember;
      }),
    );
  }

  async findOne(jobid: number, _id: number) {
    const member = await this.memberRepo.findOne({
      where: { _id, paquete: { job: { _id: jobid } } },
      relations: {
        member_material: { material: true },
        paquete: true,
        tasks: { items: { material: true } },
        member_area: { area: true, user: true },
      },
      order: {
        tasks: { items: { last_update: 'asc' } },
        member_area: { created_at: 'asc' },
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const weight = await this.mmService.getWeight(member._id);

    const groupedMaterials = member.member_material.reduce(
      (acc, mm) => {
        if (!acc[mm.material.piecemark]) {
          acc[mm.material.piecemark] = {
            ...mm.material,
            quantity: 0,
            cutted: 0,
          };
        }
        acc[mm.material.piecemark].quantity += mm.quantity;
        return acc;
      },
      {} as Record<string, any>,
    );

    if (member.tasks.length) {
      for (const task of member.tasks) {
        for (const item of task.items) {
          const piecemark = item.material.piecemark;
          if (groupedMaterials[piecemark]) {
            groupedMaterials[piecemark].cutted += item.cutted;
            groupedMaterials[piecemark]['last_update'] = item.last_update;
          }
        }
      }
    }

    member.member_material = Object.values(groupedMaterials);
    const newMember = {
      _id: member._id,
      barcode: member.barcode,
      piecemark: member.piecemark,
      mem_desc: `${member.mem_desc} ${member.main_material}`,
      quantity: member.quantity,
      weight: Math.round(weight),
      materials: member.member_material,
      areas: member.member_area.map((area) => {
        return {
          ...area,
          user: area.user.fullname(),
        };
      }),
    };

    const ma = newMember.areas.reduce(
      (acc, ma) => {
        if (!acc[ma.area._id]) {
          acc[ma.area._id] = {
            ...ma,
            quantity: 0,
          };
        }

        acc[ma.area._id].quantity += ma.quantity;
        acc[ma.area._id].created_at = ma.created_at;

        return acc;
      },
      {} as Record<number, any>,
    );
    newMember.areas = Object.values(ma);
    return newMember;
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
    try {
      return await this.memberRepo
        .createQueryBuilder('member')
        .leftJoin('member.tasks', 'task')
        .leftJoin('member.paquete', 'paquete')
        .select('member._id', 'member_id')
        .addSelect(
          "CONCAT(member.mem_desc, ' ', member.main_material)",
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
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.code);
    }
  }

  async availableMembers(jobId: number, paqueteId: number, areaId: number) {
    const members = await this.findAll(jobId, paqueteId);
    const fullyCutted = members
      .map((member) => {
        const T = [];
        member.materials.forEach((material) => {
          const tn = Math.floor(material['cutted'] / material.quantity);
          T.push(tn);
        });

        if (T.length) {
          const readyToWeldOrWelded = Math.min(...T);

          if (readyToWeldOrWelded > 0) {
            member.quantity = readyToWeldOrWelded;
            return member;
          }
        }
      })
      .filter(Boolean);

    const groupArea = fullyCutted.map((member) => {
      const ma = member.areas.reduce(
        (acc, ma) => {
          if (!acc[ma.area._id]) {
            acc[ma.area._id] = {
              ...ma,
              quantity: 0,
            };
          }

          acc[ma.area._id].quantity += ma.quantity;
          acc[ma.area._id].created_at = ma.created_at;

          return acc;
        },
        {} as Record<number, any>,
      );
      member.areas = Object.values(ma);
      return member;
    });

    return groupArea
      .map((mm) => {
        const am = mm.areas.filter((a) => a.area._id == areaId);
        if (!am) {
          return mm;
        }

        const totToArea = am.reduce((acc, ar) => (acc += ar.quantity), 0);
        if (totToArea < mm.quantity) {
          mm.quantity -= totToArea;
          return mm;
        }
      })
      .filter(Boolean);
  }

  async moveToArea(areaId: number, membertoareaDto: MemberToAreaDto[]) {
    for (const { id, quantity } of membertoareaDto) {
      this.maService.create(areaId, id, quantity);
    }
  }

  updateByCode(barcode: string, updateMemberDto: UpdateMemberDto) {
    this.memberRepo.update({ barcode }, { ...updateMemberDto });
  }
}
