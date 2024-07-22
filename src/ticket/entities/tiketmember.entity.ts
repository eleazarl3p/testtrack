import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Ticket } from './ticket.entity';
import { Member } from 'src/member/entities/member.entity';

@Entity()
export class TicketMember {
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
}
