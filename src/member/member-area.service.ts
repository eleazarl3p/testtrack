import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberArea } from './entities/memberarea.entity';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { Area } from 'src/area/entities/area.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MemberAreaService {
  constructor(
    @InjectRepository(MemberArea)
    private readonly maRepo: Repository<MemberArea>,
  ) {}

  async create(areaId: number, memberId: number, quantity: number) {
    try {
      const w = this.maRepo.create({ quantity });
      w.member = { _id: memberId } as Member;
      w.area = { _id: areaId } as Area;
      w.user = { _id: 1 } as User;
      await w.save();
    } catch (error) {
      console.log('error create ma ', error);
    }
  }
  async getMemberArea(areaId: number, memberId?: number) {
    if (memberId != undefined) {
      return this.maRepo.find({
        where: { member: { _id: memberId }, area: { _id: areaId } },
      });
    }
  }
}
