import { PartialType } from '@nestjs/swagger';
import { CreateTcommentDto } from './create-tcomment.dto';

export class UpdateTcommentDto extends PartialType(CreateTcommentDto) {}
