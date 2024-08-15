import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';
import { Member } from 'src/member/entities/member.entity';

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

  @Column({ type: 'timestamp', nullable: true })
  last_update: Date | null;
}
