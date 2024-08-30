import { IsNumber } from 'class-validator';

export class UpdateTaskItemDto {
  @IsNumber()
  _id: number;

  @IsNumber()
  assigned: number;

  @IsNumber()
  cut: number;
}
