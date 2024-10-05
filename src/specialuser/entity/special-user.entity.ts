import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum userType {
  INSPECTOR = 'Inspector',
  FABRICATOR = 'Fabricator',
}

@Entity()
export class SpecialUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: userType,
  })
  role: userType;
}
