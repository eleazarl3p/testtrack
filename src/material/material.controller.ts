import { Controller, Get, Param } from '@nestjs/common';
import { MaterialService } from './material.service';

@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Get()
  findAll() {
    return this.materialService.findAll();
  }

  @Get(':jobname/:piecemark')
  findOne(
    @Param('jobname') jobname: string,
    @Param('piecemark') piecemark: string,
  ) {
    return this.materialService.findOne(piecemark, jobname);
  }
}
