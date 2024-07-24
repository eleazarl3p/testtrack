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

@Controller('tickets')
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

  @Patch('teams/:id')
  updateTeam(@Param('id', ParseIntPipe) id: number, @Body() { items }: any) {
    return this.ticketService.updateTeam(id, items);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(+id);
  }
}
