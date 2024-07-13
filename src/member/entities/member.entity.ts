import { Job } from 'src/job/entites/job.entity';
import { Material } from 'src/material/entities/material.entity';
import { Paquete } from 'src/paquete/entities/paquete.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  number: number;

  @Column()
  idx_pcmk: number;

  @Column()
  piecemark: string;

  @Column({ unique: true })
  barcode: string;

  @Column()
  mem_desc: string;

  @Column()
  quantity: number;

  @ManyToMany(() => Material, (material) => material.members, { eager: true })
  @JoinTable()
  materials: Material[];

  // @OneToMany(
  //   () => MemberToMaterial,
  //   (member_to_material) => member_to_material.member,
  // )
  // public member_to_materials: MemberToMaterial[];

  // @OneToMany(() => Member_History, (mh) => mh.member, {
  //   cascade: true,
  // })
  // history: Member_History[];

  @ManyToOne(() => Paquete, (paquete) => paquete.members)
  paquete: Paquete;

  //   @OneToOne(() => Ticket_Item, (item) => item.member)
  //   ticket_item: Ticket_Item;

  @CreateDateColumn()
  create_date: Date;
}
