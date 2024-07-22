import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Shape {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({ unique: true })
  name: string;
}
