import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';
import { Member } from 'src/member/entities/member.entity';
import { Team } from 'src/team/entities/team.entity';

@Entity()
export class TicketMember extends BaseEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  quantity: number;

  @Column({ default: 0 })
  loaded: number;

  @Column({ default: 0 })
  delivered: number;

  @ManyToOne(() => Member, (member) => member.ticket_member)
  member: Member;

  @ManyToOne(() => Ticket, (tk) => tk.ticket_member)
  ticket: Ticket;

  @ManyToOne(() => Team)
  team: Team;
}
//11125-1
