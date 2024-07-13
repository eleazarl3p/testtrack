import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Member } from './member.entity';
import { Material } from 'src/material/entities/material.entity';

// @Entity()
// export class MemberToMaterial {
//   @PrimaryGeneratedColumn()
//   public member_to_material_id: number;

//   @Column()
//   public member_id: number;

//   @Column()
//   public material_id: number;

//   @Column()
//   public quantity: number;

//   @Column()
//   public cuted: number;

//   @ManyToOne(() => Member, (member) => member.member_to_materials)
//   public member: Member;

//   @ManyToOne(() => Material, (material) => material.member_to_materials)
//   public material: Material;
// }
