import { Ticket } from 'src/ticket/entities/ticket.entity';
import { User } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Tcomment extends BaseEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  details: string;

  @ManyToOne(() => Ticket, (ticket) => ticket.comments)
  ticket: Ticket;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
}
