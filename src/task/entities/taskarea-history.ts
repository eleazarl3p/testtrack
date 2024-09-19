import { User } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskArea } from './taskarea.entity';

@Entity()
export class TaskAreaHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  //   @Column()
  //   quantity: number;

  @Column({ default: 0 })
  completed: number;

  @Column({ nullable: true })
  approved: boolean;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => User)
  reviewed_by: User;

  @ManyToOne(() => TaskArea, (ta) => ta.history)
  task_area: TaskArea;
}
