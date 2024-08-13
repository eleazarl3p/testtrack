import { IsNumber } from 'class-validator';

export class MemberToAreaDto {
  @IsNumber()
  id: number;

  @IsNumber()
  quantity: number;
}
