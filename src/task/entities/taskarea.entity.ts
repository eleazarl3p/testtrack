import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Task } from './task.entity';
import { Area } from 'src/area/entities/area.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
@Unique(['task_id', 'area_id'])
export class TaskArea extends BaseEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  task_id: number;

  @Column()
  area_id: number;

  @Column()
  quantity: number;

  @Column({ default: 0 })
  completed: number;

  @Column({ nullable: true })
  approved: boolean;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => User)
  reviewed_by: User;

  @ManyToOne(() => Task, (task) => task.task_area)
  task: Task;

  @ManyToOne(() => Area, (area) => area.task_area)
  area: Area;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
}
