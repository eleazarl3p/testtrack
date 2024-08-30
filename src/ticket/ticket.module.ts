import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { TicketMember } from './entities/tiketmember.entity';
import { MemberModule } from 'src/member/member.module';

import { OtherItem } from './entities/other-item.entity';
import { JobModule } from 'src/job/job.module';
import { Tcomment } from './entities/tcomment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, TicketMember, OtherItem, Tcomment]),
    MemberModule,
    JobModule,
  ],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
