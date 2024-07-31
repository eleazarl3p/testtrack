import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Controller('models')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  findAll() {
    return this.jobService.findAll();
  }

  @Post()
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobService.create(createJobDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateModelDto: UpdateJobDto) {
    return this.jobService.update(id, updateModelDto);
  }

  @Delete(':id')
  //delete(@Param('id') id: number, @GetUser() user) {
  delete(@Param('id') id: number, @Req() req: any) {
    return this.jobService.delete(id);
  }
}
