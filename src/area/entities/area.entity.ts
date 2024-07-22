import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Area {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  barcode: string;

  // @OneToMany(() => MaterialHistory, (mh) => mh.area)
  // mat_history: MaterialHistory[];

  //   @OneToMany(() => Member_History, (mmh) => mmh.area)
  //   mem_history: Member_History[];

  //   @OneToMany(() => Shipping_State, (shp) => shp.area)
  //   ship_states: Shipping_State[];
}
