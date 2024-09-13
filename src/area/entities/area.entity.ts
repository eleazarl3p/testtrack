import { TaskArea } from 'src/task/entities/taskarea.entity';
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

  @OneToMany(() => TaskArea, (ta) => ta.area)
  task_area: TaskArea[];
  // @OneToMany(() => MaterialHistory, (mh) => mh.area)
  // mat_history: MaterialHistory[];

  //   @OneToMany(() => Member_History, (mmh) => mmh.area)
  //   mem_history: Member_History[];

  //   @OneToMany(() => Shipping_State, (shp) => shp.area)
  //   ship_states: Shipping_State[];
}
