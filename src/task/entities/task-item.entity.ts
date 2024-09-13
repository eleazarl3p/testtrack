import { Material } from 'src/material/entities/material.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { Machine } from 'src/machine/entities/machine.entity';
import { CutHistory } from './cut-history.entity';

@Entity()
export class TaskItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  assigned: number;

  @ManyToOne(() => Material, (material) => material.task_items)
  material: Material;

  @ManyToOne(() => Task, (task) => task.items)
  task: Task;

  @ManyToOne(() => Machine, (machine) => machine.tasks_items)
  machine: Machine;

  @OneToMany(() => CutHistory, (ch) => ch.task_item)
  cut_history: CutHistory[];
}
