import { ApiProperty } from '@nestjs/swagger';
import { Level } from 'src/level/entities/level.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';

// import { Ticket_Event } from 'src/ticket/entities/ticket_event.etity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

export enum AuthorizedApps {
  DESKTOP = 'Desktop',
  MOBILE = 'Mobile',
}

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  NOTASSIGNED = 'not assigned',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  _id: number;

  @ApiProperty({ example: 'Juan' })
  @Column()
  first_name: string;

  @ApiProperty({ example: '' })
  @Column()
  middle_name: string;

  @ApiProperty({ example: 'Pepe' })
  @Column()
  last_name: string;

  @ApiProperty({ example: 'Admin' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ example: 'name@example.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'admin' })
  @Column()
  password: string;

  @Column({
    type: 'set',
    enum: AuthorizedApps,
    default: [AuthorizedApps.DESKTOP, AuthorizedApps.MOBILE],
  })
  authorized_apps: string[];

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.NOTASSIGNED,
  })
  role: UserRole;

  @CreateDateColumn()
  created_at: Timestamp;

  //   @OneToMany(() => Material_History, (mh) => mh.user)
  //   worked_materials: Material_History[];

  //   @OneToMany(() => Member_History, (mbh) => mbh.user)
  //   worked_members: Member_History[];

  @ManyToOne(() => Level, (level) => level.users)
  level: Level;

  @OneToMany(() => Ticket, (tkts) => tkts.created__by__user)
  tickets: Ticket[];

  //   @OneToMany(() => Shipping_State, (shps) => shps.user)
  //   shipments: Shipping_State;
}
