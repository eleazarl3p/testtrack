import { PartialType } from '@nestjs/swagger';
import { CreateTeamDto } from './create-team.dto';
import { IsNumber } from 'class-validator';

export class UpdateTeamDto extends PartialType(CreateTeamDto) {
  @IsNumber()
  _id: number;
}
