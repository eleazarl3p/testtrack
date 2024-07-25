import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { MemberService } from 'src/member/member.service';

import { TicketMember } from './entities/tiketmember.entity';
import { Member } from 'src/member/entities/member.entity';
import { OtherItem } from './entities/other-item.entity';
import { MemberMaterialService } from 'src/member/membermaterial.service';
import { JobService } from 'src/job/job.service';
import { TicketItemDto } from './dto/ticket-item.dto';
import { time } from 'console';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,

    @InjectRepository(TicketMember)
    private readonly tkmRepo: Repository<TicketMember>,

    @InjectRepository(OtherItem)
    private readonly otmRepo: Repository<OtherItem>,

    private readonly memberService: MemberService,

    private readonly mmService: MemberMaterialService,

    private readonly jobService: JobService,
  ) {}

  async create(createTicketDto: CreateTicketDto, job_name: string) {
    const { ticketItems, otherItems, ...ticketDto } = createTicketDto;

    let lastTicketId = await this.getCurrentJobLastTicketId(job_name);
    lastTicketId += 1;
    const barcode = `TI-${job_name}-${lastTicketId.toString().padStart(5, '0')}`;

    const ticket = await this.ticketRepo.save({ barcode, ...ticketDto });

    for (const ti of ticketItems) {
      const tkm = this.tkmRepo.create(ti);
      tkm.ticket = ticket;
      tkm.member = { _id: ti.member_id } as Member;
      await this.tkmRepo.save(tkm);
    }

    for (const otm of otherItems) {
      const otherItem = this.otmRepo.create(otm);
      otherItem.ticket = ticket;
      await this.otmRepo.save(otherItem);
    }

    return await this.findOne(ticket.barcode);
  }

  async findAll() {
    return this.ticketRepo.find({ select: ['barcode'] });
  }

  async findOne(barcode: string) {
    const ticket = await this.ticketRepo.findOne({
      where: { barcode },
      relations: {
        ticket_member: { member: true },
        other_items: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException(
        'Ticket Not Found.\nPlease Review Ticket Number And Try Again.',
      );
    }
    ticket['items'] = await Promise.all(
      Object.values(ticket.ticket_member).map(async (mb) => {
        return {
          quantity: mb.quantity,
          loaded: mb.loaded,
          delivered: mb.delivered,
          piecemark: mb.member.piecemark,
          mem_desc: `${mb.member.mem_desc} ${mb.member.main_material}`,
          weight: Math.round(await this.mmService.getWeight(mb.member._id)),
          team: mb.team,
        };
      }),
    );

    const jobName = ticket.barcode.split('-')[1];

    try {
      const job = await this.jobService.find(jobName);
      ticket['job_name'] = job.job_name;
      ticket['job_address'] =
        `${job.address.street}, ${job.address.state} ${job.address.zip}`.replace(
          '  ',
          ' ',
        );
    } catch (error) {
      ticket['job_name'] = jobName;
      ticket['job_address'] = '...';
    }

    ticket['shipping'] = null;
    delete ticket.ticket_member;
    return ticket;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  async updateTeam(_id: number, items: TicketItemDto[]) {
    const ticket = await this.ticketRepo.findOne({
      where: { _id },
      relations: { ticket_member: true },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket Not Found.');
    }

    for (const i in ticket.ticket_member) {
      try {
        ticket.ticket_member[i].team = items[i].team;
        await ticket.ticket_member[i].save();
      } catch (error) {}
    }

    return await ticket.save();
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }

  async availableMembers(jobid: number) {
    const members = await this.memberService.findAll(jobid, undefined);

    const filteredMembers = await Promise.all(
      members.map(async (mb) => {
        const count = await this.countMemberTicket(mb._id);
        if (mb.quantity > count) {
          const available = mb.quantity - count;
          delete mb.quantity;
          return {
            ...mb,
            available,
          };
        }
      }),
    );
    return filteredMembers.filter((m) => m != null);
  }

  async countMemberTicket(member_id: number) {
    const qt = await this.tkmRepo.find({
      where: { member: { _id: member_id } },
      relations: { member: true },
      select: ['quantity'],
    });

    return qt.reduce((total, tm) => total + tm.quantity, 0);
  }

  async getCurrentJobLastTicketId(job_name: string): Promise<number> {
    const tk = await this.ticketRepo
      .createQueryBuilder()
      .select('_id', 'id')
      .addSelect('barcode')
      .where('barcode like :f', { f: `TI-${job_name}%` })
      .getRawMany();

    if (tk.length == 0) {
      return 0;
    }

    try {
      const barcodeId = tk.pop().barcode.split('-').pop();
      return Number.parseInt(barcodeId);
    } catch {
      return 0;
    }
  }
}
