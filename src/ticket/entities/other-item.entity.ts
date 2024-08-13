import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';

@Entity()
export class OtherItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  details: string;

  @Column()
  quantity: number;

  @Column({ default: 0 })
  loaded: number;

  @Column({ default: 0 })
  delivered: number;

  @ManyToOne(() => Ticket, (tk) => tk.other_items)
  ticket: Ticket;
}
