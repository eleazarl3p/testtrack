import { MemberMaterial } from 'src/member/entities/membermaterial.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Material {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({ unique: true })
  barcode: string;

  @Column()
  guid: string;

  @Column({ type: 'float', precision: 10, scale: 4 })
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

  @Column({ type: 'float', precision: 10, scale: 4 })
  width: number;

  @OneToMany(() => MemberMaterial, (mm) => mm.material)
  member_material: MemberMaterial[];

  @CreateDateColumn()
  created_at: Date;
}
