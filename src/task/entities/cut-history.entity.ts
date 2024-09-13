import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskItem } from './task-item.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class CutHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  approved: number;

  @Column({ default: '' })
  comments: string;

  @UpdateDateColumn({ type: 'datetime' })
  last_update: Date;

  @ManyToOne(() => TaskItem, (ti) => ti.cut_history)
  task_item: TaskItem;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => User)
  reviewed_by: User;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
}
