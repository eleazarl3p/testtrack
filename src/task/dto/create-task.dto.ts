import { IsNumber, IsString } from 'class-validator';

export class TaskDto {
  @IsNumber()
  assigned: number;

  @IsNumber()
  priority: number;

  @IsNumber()
  member_id: number;

  @IsString()
  piecemark: string;

  @IsNumber()
  paquete_id: number;

  @IsNumber()
  team_id: number;

  @IsNumber()
  job_id: number;
}
