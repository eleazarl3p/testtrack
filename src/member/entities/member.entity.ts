import { Paquete } from 'src/paquete/entities/paquete.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MemberMaterial } from './membermaterial.entity';
import { TicketMember } from 'src/ticket/entities/tiketmember.entity';
import { Task } from 'src/task/entities/task.entity';
import { MemberArea } from './memberarea.entity';

@Entity()
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  idx_pcmk: number;

  @Column()
  main_material: string;

  @Column()
  piecemark: string;

  @Column({ unique: true })
  barcode: string;

  @Column()
  mem_desc: string;

  @Column()
  quantity: number;

  @ManyToOne(() => Paquete, (paquete) => paquete.members)
  paquete: Paquete;

  @CreateDateColumn()
  create_date: Date;

  @OneToMany(() => MemberMaterial, (mm) => mm.member)
  member_material: MemberMaterial[];

  @OneToMany(() => TicketMember, (tm) => tm.member)
  ticket_member: TicketMember[];

  @OneToMany(() => Task, (tsk) => tsk.member)
  tasks: Task[];

  @OneToMany(() => MemberArea, (ma) => ma.member)
  member_area: MemberArea[];
}
