import { Contact } from 'src/contact/entities/contact.entity';
import { AddressDto } from 'src/otherDtos/address.dto';
import { Paquete } from 'src/paquete/entities/paquete.entity';
import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['job_name', 'barcode'])
export class Job extends BaseEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column('varchar', { length: 25 })
  job_name: string;

  @Column({ unique: true })
  barcode: string;

  @Column({ nullable: true })
  url_3d: string;

  @Column('json', { nullable: true })
  address: AddressDto;

  @OneToMany(() => Paquete, (paquete) => paquete.job)
  paquetes: Paquete[];

  @ManyToOne(() => Contact, (contact) => contact.installed_job)
  installer: Contact;

  @ManyToOne(() => Contact, (contact) => contact.gc_job)
  gc: Contact;

  @DeleteDateColumn()
  deleteDate: Date;
}
