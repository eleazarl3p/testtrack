import { Task } from 'src/task/entities/task.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Task, (task) => task.team)
  tasks: Task[];

  @DeleteDateColumn({ type: 'datetime' })
  deleted_at: Date;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
}
