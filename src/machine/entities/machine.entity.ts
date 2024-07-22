import { Shape } from 'src/shape/entities/shape.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Machine extends BaseEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  name: string;

  @ManyToMany(() => Shape, { eager: true })
  @JoinTable()
  shapes: Shape[];
}
