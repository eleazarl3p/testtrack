import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TicketMember } from './tiketmember.entity';
import { User } from 'src/user/entities/user.entity';
import { OtherItem } from './other-item.entity';

export enum ticketType {
  ERECT = 'ERECT',
  DELIVER = 'DELIVER',
}

@Entity()
export class Ticket extends BaseEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({ type: 'enum', enum: ticketType, default: ticketType.ERECT })
  ticket_type: string;

  @Column()
  barcode: string;

  @Column()
  contact: string;

  @OneToMany(() => TicketMember, (tk) => tk.ticket)
  ticket_member: TicketMember;

  @OneToMany(() => OtherItem, (ot) => ot.ticket)
  other_items: OtherItem[];

  @ManyToOne(() => User, (usr) => usr.tickets)
  created__by__user: User;

  @CreateDateColumn()
  created_at: Date;
}
