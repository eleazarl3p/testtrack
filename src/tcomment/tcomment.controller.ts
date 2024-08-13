import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TcommentService } from './tcomment.service';
import { CreateTcommentDto } from './dto/create-tcomment.dto';
import { UpdateTcommentDto } from './dto/update-tcomment.dto';

@Controller('tcomment')
export class TcommentController {
  constructor(private readonly tcommentService: TcommentService) {}

  @Post()
  create(@Body() createTcommentDto: CreateTcommentDto) {
    return this.tcommentService.create(createTcommentDto);
  }

  @Get()
  findAll() {
    return this.tcommentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tcommentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTcommentDto: UpdateTcommentDto,
  ) {
    return this.tcommentService.update(+id, updateTcommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tcommentService.remove(+id);
  }
}
