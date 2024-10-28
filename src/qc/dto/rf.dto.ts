import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { fitUpInspection } from '../entity/inspection.entity';
import { Type } from 'class-transformer';
import { CreateSpecialUserDto } from 'src/specialuser/dto/create-special-user.dto';
import { CriteriaAnswer } from './create-criteria.dto';

export class RFDto {
  @IsString()
  job: string;

  @IsString()
  inspection_type: string;

  @IsString()
  comments: string;

  @IsArray()
  @IsString({ each: true })
  photos: string[];

  @IsEnum(fitUpInspection)
  fit_up_inspection: fitUpInspection;

  @IsBoolean()
  non_conformance: boolean;

  @ValidateNested()
  @Type(() => CreateSpecialUserDto)
  inspector: CreateSpecialUserDto;

  @ValidateNested()
  @Type(() => CreateSpecialUserDto)
  fabricator: CreateSpecialUserDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CriteriaAnswer)
  criteria_answers: CriteriaAnswer[];

  @IsArray()
  @IsNumber({}, { each: true })
  ids: number[];
}
