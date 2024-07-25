import { Team } from 'src/team/entities/team.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  _id: number;

  @ManyToOne(() => Team)
  team: Team;
}
