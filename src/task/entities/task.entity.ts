import { Member } from 'src/member/entities/member.entity';
import { Team } from 'src/team/entities/team.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskItem } from './task-item.entity';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  quantity: number;

  @Column()
  expected_date: Date;

  @Column()
  estimated_date: Date;

  @ManyToOne(() => Member)
  member: Member;

  @ManyToOne(() => Team, (team) => team.tasks)
  team: Team;

  @OneToMany(() => TaskItem, (item) => item.task)
  items: TaskItem[];

  @CreateDateColumn()
  created_at: Date;
}
