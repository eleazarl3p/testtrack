import { Ticket } from 'src/ticket/entities/ticket.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Tcomment {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  details: string;

  @ManyToOne(() => Ticket, (ticket) => ticket.comments)
  ticket: Ticket;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  created_at: Date;
}
