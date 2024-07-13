import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MaterialService } from 'src/material/material.service';
import { Material } from 'src/material/entities/material.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepo: Repository<Member>,

    private readonly materialService: MaterialService,
  ) {}

  async create(createMemberDto: CreateMemberDto) {
    const { materials, ...memberDto } = createMemberDto;

    try {
      const newMember = this.memberRepo.create(memberDto);
      const savedMember = await this.memberRepo.save(newMember);
      const member = await this.memberRepo.findOneBy({ _id: savedMember._id });
      const mmaterials = [];
      for (const mat of materials) {
        try {
          let material = await this.materialService.findOneByPiecemark(
            mat.piecemark,
          );

          if (material == null) {
            material = await this.materialService.create(mat);
          }
          mmaterials.push(material);
        } catch (error) {
          console.log(error);
        }
      }

      member.materials = mmaterials;
      await this.memberRepo.save(member);
      return member;
    } catch (error) {
      console.log(error.code);
      throw new BadRequestException();
    }

    // const newMember = this.memberRepo.create(createMemberDto);
    // try {
    //   return await this.memberRepo.save(newMember);
    // } catch (error) {
    //   return null;
    // }
  }

  findAll() {
    return this.memberRepo.find({ relations: { materials: true } });
  }

  findOne(id: number) {
    return `This action returns a #${id} member`;
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }
}
