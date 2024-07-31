import { Shape } from 'src/shape/entities/shape.entity';
import { TaskItem } from 'src/task/entities/task-item.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Machine extends BaseEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  name: string;

  @ManyToMany(() => Shape, (sh) => sh.machines, { eager: true })
  @JoinTable()
  shapes: Shape[];

  @OneToMany(() => TaskItem, (ti) => ti.machine)
  tasks_items: TaskItem[];
}
