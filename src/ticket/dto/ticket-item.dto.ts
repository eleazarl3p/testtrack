import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class TicketItemDto {
  @IsNumber()
  member_id: number;

  @IsNotEmpty()
  @IsString()
  piecemark: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;

  @IsOptional()
  @IsNumber()
  loaded: number;

  @IsOptional()
  @IsNumber()
  delivered: number;
}

export class OtherItemDto {
  @IsNotEmpty()
  @IsString()
  details: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;
}
