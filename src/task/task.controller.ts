import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CustomTaskValitationPipe } from './dto/validate-task.pipe';
import { UpdateTaskItemDto } from './dto/update-tast-item.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body(new CustomTaskValitationPipe()) tasks: TaskDto[]) {
    return this.taskService.create(tasks);
  }

  @Post('cut-materials')
  async cutTaskItems(@Body() updateTaskItemDto: UpdateTaskItemDto[]) {
    return await this.taskService.updateTaskItem(updateTaskItemDto);
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
