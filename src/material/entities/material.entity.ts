import { Member } from 'src/member/entities/member.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
//@Unique(['guid'])
export class Material extends BaseEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({ unique: true })
  barcode: string;

  // @Column('int', { array: true })
  // color: number;
  @Column()
  guid: string;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  length: number;

  @Column()
  mark: string;

  @Column()
  piecemark: string;

  @Column()
  material_grade: string;

  @Column()
  material_type: string;

  @Column()
  mtrl_idx: number;

  @Column()
  remark: string;

  @Column()
  section: string;

  @Column()
  zone: string;

  @Column()
  sub_mtrl_idx: number;

  @Column({ type: 'float', precision: 10, scale: 4 })
  weight: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  width: number;

  // @OneToMany(
  //   () => MemberToMaterial,
  //   (member_to_material) => member_to_material.material,
  // )
  // public member_to_materials: MemberToMaterial[];

  //   @OneToOne(() => Material_History, (mh) => mh.material, { cascade: true })
  //   history: Material_History;

  @ManyToMany(() => Member, (member) => member.materials)
  members: Member[];

  @CreateDateColumn()
  create_date: Date;
}
