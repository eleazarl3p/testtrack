import { PartialType } from '@nestjs/swagger';
import { CreateTicketDto } from './create-ticket.dto';
import { IsNumber } from 'class-validator';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {}
