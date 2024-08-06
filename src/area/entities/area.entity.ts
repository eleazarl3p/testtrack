import { MemberArea } from 'src/member/entities/memberarea.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Area {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true, nullable: true })
  barcode: string;

  @Column({ default: 'xmark' })
  image: string;

  @OneToMany(() => MemberArea, (ma) => ma.area)
  member_area: MemberArea[];

  // @OneToMany(() => MaterialHistory, (mh) => mh.area)
  // mat_history: MaterialHistory[];

  //   @OneToMany(() => Member_History, (mmh) => mmh.area)
  //   mem_history: Member_History[];

  //   @OneToMany(() => Shipping_State, (shp) => shp.area)
  //   ship_states: Shipping_State[];
}
