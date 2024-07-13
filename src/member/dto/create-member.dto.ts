import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { CreateMaterialDto } from 'src/material/dto/create-material.dto';

export class CreateMemberDto {
  @IsNumber()
  number: number;

  @IsString()
  barcode: string;

  @IsNumber()
  idx_pcmk: number;

  @IsString()
  piecemark: string;

  @IsString()
  mem_desc: string;

  @IsNumber()
  quantity: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMaterialDto)
  materials: CreateMaterialDto[];
}
