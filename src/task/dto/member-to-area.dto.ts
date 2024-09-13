import { IsNumber } from 'class-validator';

export class TaskToAreaDto {
  @IsNumber()
  _id: number;

  @IsNumber()
  quantity: number;
}
