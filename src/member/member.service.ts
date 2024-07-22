import { BadRequestException, Injectable } from '@nestjs/common';
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

  async findAll(job_id: number, paquete_id: string) {
    let members: Member[];
    if (paquete_id != undefined) {
      try {
        const pq_id = Number.parseInt(paquete_id);
        members = await this.memberRepo.find({
          where: {
            paquete: { _id: pq_id, job: { _id: job_id } },
          },
          relations: { paquete: { job: true } },
        });
      } catch {
        throw new BadRequestException('Invalid paquete id');
      }
    } else {
      members = await this.memberRepo.find({
        where: {
          paquete: { job: { _id: job_id } },
        },
        relations: { paquete: { job: true } },
      });
    }

    return await Promise.all(
      members.map(async (mb) => {
        const weight = await this.mmService.getWeight(mb._id);
        return {
          _id: mb._id,
          piecemark: mb.piecemark,
          mem_desc: `${mb.mem_desc} ${mb.main_material}`,
          quantity: mb.quantity,
          weight: Math.round(weight),
        };
      }),
    );
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

  async buildOfMaterials(paquete_id: number, piecemark: string) {
    const member = await this.memberRepo.findOne({
      where: { piecemark, paquete: { _id: paquete_id } },
      relations: { member_material: { material: true } },
    });

    const weight = await this.mmService.getWeight(member._id);
    return {
      main_material: member.main_material,
      piecemark: member.piecemark,
      barcode: member.barcode,
      mem_desc: member.mem_desc,
      quantity: member.quantity,
      weight: Math.round(weight),
      materials: member.member_material.map((mat) => {
        return {
          quantity: mat.quantity,
          cuted: mat.cuted,
          ...mat.material,
        };
      }),
    };
  }

  updateByCode(barcode: string, updateMemberDto: UpdateMemberDto) {
    this.memberRepo.update({ barcode }, { ...updateMemberDto });
  }
}
