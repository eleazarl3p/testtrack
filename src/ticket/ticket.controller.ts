import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post(':jobname')
  create(
    @Param('jobname') jobname: string,
    @Body() createTicketDto: CreateTicketDto,
  ) {
    return this.ticketService.create(createTicketDto, jobname);
  }

  @Get()
  findAll() {
    return this.ticketService.findAll();
  }

  @Get('job/:jobname')
  findAllByJob(@Param('jobname') jobname: string) {
    return this.ticketService.findAllByJob(jobname);
  }

  @Get(':barcode')
  findOne(@Param('barcode') barcode: string) {
    return this.ticketService.findOne(barcode);
  }

  @Get('available-members/:jobid/')
  availableMembers(@Param('jobid', ParseIntPipe) jobid: number) {
    return this.ticketService.availableMembers(jobid);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketService.update(+id, updateTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(+id);
  }
}
