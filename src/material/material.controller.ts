import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MaterialService } from './material.service';

@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Get(':jobid/')
  findAll(@Param('jobid', ParseIntPipe) jobid: number) {
    return this.materialService.findAll(jobid);
  }

  @Get(':jobid/:piecemark')
  findOne(
    @Param('jobid', ParseIntPipe) jobId: number,
    @Param('piecemark') piecemark: string,
  ) {
    return this.materialService.findOne(piecemark, jobId);
  }
}
