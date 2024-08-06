import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WeldingService } from './welding.service';
import { CreateWeldingDto } from './dto/create-welding.dto';
import { UpdateWeldingDto } from './dto/update-welding.dto';

@Controller('welding')
export class WeldingController {
  constructor(private readonly weldingService: WeldingService) {}

  @Post()
  create(@Body() createWeldingDto: CreateWeldingDto) {
    return this.weldingService.create(createWeldingDto);
  }

  @Get()
  findAll() {
    return this.weldingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.weldingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWeldingDto: UpdateWeldingDto) {
    return this.weldingService.update(+id, updateWeldingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.weldingService.remove(+id);
  }
}
