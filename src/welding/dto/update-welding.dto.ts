import { PartialType } from '@nestjs/swagger';
import { CreateWeldingDto } from './create-welding.dto';

export class UpdateWeldingDto extends PartialType(CreateWeldingDto) {}
