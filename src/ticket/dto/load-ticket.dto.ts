import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ldDto {
  @IsNumber()
  _id: number;

  @IsNumber()
  loaded: number;

  @IsNumber()
  delivered: number;
}
export class LoadTicketDto {
  @IsString()
  @IsOptional()
  comments: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ldDto)
  items: ldDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ldDto)
  other_items: ldDto[];
}
