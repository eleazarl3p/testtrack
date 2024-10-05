import { SpecialUser } from 'src/specialuser/entity/special-user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InspectionCriteria } from './inspection-criteria.entity';
import { json } from 'stream/consumers';
import { TaskItem } from 'src/task/entities/task-item.entity';
import { Task } from 'src/task/entities/task.entity';
import { CutHistory } from 'src/task/entities/cut-history.entity';

export enum fitUpInspection {
  INPROGRESS = 'In Progress',
  PASS = 'Pass',
  FAIL = 'Fail',
}
@Entity()
export class MaterialInspection {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  job: string;

  @Column()
  inspection_type: string;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ type: 'json', nullable: true })
  photos: string[];

  @Column({ type: 'enum', enum: fitUpInspection })
  fit_up_inspection: fitUpInspection;

  @Column({ type: 'boolean', default: false })
  non_conformance: boolean;

  @ManyToOne(() => SpecialUser)
  inspector: SpecialUser;

  @ManyToOne(() => SpecialUser)
  fabricator: SpecialUser;

  @OneToMany(() => InspectionCriteria, (ic) => ic.materialInpection)
  criteriaAnswers: InspectionCriteria[];
}

@Entity()
export class MemberInspection {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  job: string;

  @Column()
  inspection_type: string;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ type: 'json', nullable: true })
  photos: string[];

  @Column({ type: 'enum', enum: fitUpInspection })
  fit_up_inspection: fitUpInspection;

  @Column({ type: 'boolean', default: false })
  non_conformance: boolean;

  @ManyToOne(() => SpecialUser)
  inspector: SpecialUser;

  @ManyToOne(() => SpecialUser)
  fabricator: SpecialUser;

  @OneToOne(() => TaskItem)
  @JoinColumn()
  task_area: TaskItem;

  @OneToMany(() => InspectionCriteria, (ic) => ic.memberInpection)
  criteriaAnswers: InspectionCriteria[];
}
