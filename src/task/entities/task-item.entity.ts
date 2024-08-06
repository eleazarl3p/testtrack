import { Material } from 'src/material/entities/material.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { Machine } from 'src/machine/entities/machine.entity';

@Entity()
export class TaskItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  assigned: number;

  @Column({ default: 0 })
  cutted: number;

  @ManyToOne(() => Material, (material) => material.task_items)
  material: Material;

  @ManyToOne(() => Task, (task) => task.items)
  task: Task;

  @ManyToOne(() => Machine, (machine) => machine.tasks_items)
  machine: Machine;
}
