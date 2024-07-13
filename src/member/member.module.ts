import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';

import { MaterialModule } from 'src/material/material.module';

@Module({
  imports: [TypeOrmModule.forFeature([Member]), MaterialModule],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
