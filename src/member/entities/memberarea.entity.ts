import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { Area } from 'src/area/entities/area.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class MemberArea extends BaseEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Member, (member) => member.member_area)
  member: Member;

  @ManyToOne(() => Area, (area) => area.member_area)
  area: Area;

  @ManyToOne(() => User)
  user: User;
}
