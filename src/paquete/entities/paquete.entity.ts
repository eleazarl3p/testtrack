import { Job } from 'src/job/entites/job.entity';
import { Member } from 'src/member/entities/member.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['name', 'job'])
export class Paquete extends BaseEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  url_drawings: string;

  @Column({ nullable: true })
  url_3d: string;

  @OneToMany(() => Member, (member) => member.paquete)
  members: Member[];

  @ManyToOne(() => Job, (job) => job.paquetes)
  job: Job;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @DeleteDateColumn({ type: 'datetime' })
  deleted_at: Date;
}
