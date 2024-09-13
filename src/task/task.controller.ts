import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  ParseIntPipe,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CustomTaskValitationPipe } from './dto/validate-task.pipe';
import { CutItemDto, CutTaskItemDto } from './dto/update-tast-item.dto';
import { AuthGuard } from '@nestjs/passport';
import { TaskToAreaDto } from './dto/member-to-area.dto';

@Controller('task')
@UseGuards(AuthGuard('jwt'))
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body(new CustomTaskValitationPipe()) tasks: TaskDto[]) {
    return this.taskService.create(tasks);
  }

  @Post('cut-materials')
  async cutTaskItems(@Body() cutItemDto: CutItemDto[], @Req() req: any) {
    const userId = req.user.sub;
    // console.log(userId);
    return await this.taskService.cutTaskItems(cutItemDto, userId);
  }

  @Post('move-to-area/:area')
  async moveToArea(
    @Param('area', ParseIntPipe) areaId: number,
    @Body() taskToAreaDto: TaskToAreaDto[],
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    return await this.taskService.moveToArea(areaId, taskToAreaDto, userId);
  }

  @Get('machine/pending-tasks/:machine/:paquete')
  pendingTaskMachine(
    @Param('machine', ParseIntPipe) machineId: number,
    @Param('paquete', ParseIntPipe) paqueteId: number,
    @Query('all', ParseBoolPipe) all: boolean,
  ) {
    return this.taskService.pendingTaskMachine(machineId, paqueteId, all);
  }

  @Get('area/pending-tasks/:area/:paquete')
  pendingTaskArea(
    @Param('area', ParseIntPipe) areaId: number,
    @Param('paquete', ParseIntPipe) paqueteId: number,
    @Query('all', ParseBoolPipe) all: boolean,
  ) {
    return this.taskService.pendingTaskArea(areaId, paqueteId, all);
  }

  @Get('recently-cut-materials/:paquete')
  async recentlyCutMaterials(
    @Param('paquete', ParseIntPipe) paqueteId: number,
  ) {
    return await this.taskService.recentlyCutMaterials(paqueteId);
  }

  // @Get('fully-cut-tasks/:paquete')
  // async fullyCutTasks(@Param('paquete', ParseIntPipe) paqueteId: number) {
  //   return await this.taskService.fullyCutTasks(paqueteId);
  // }

  // @Get('get-tasks-area/:area/:paquete')
  // async getTaskArea(
  //   @Param('area', ParseIntPipe) areaId: number,
  //   @Param('paquete', ParseIntPipe) paqueteId: number,
  //   @Query('completed') completed: string,
  // ) {
  //   return await this.taskService.getTaskArea(areaId, paqueteId, completed);
  // }

  @Patch('expected/date/update')
  async update(@Body() updateTaskDto: UpdateTaskDto[]) {
    return await this.taskService.update(updateTaskDto);
  }

  @Patch('review-materials/:area')
  async reviewCutMaterials(
    @Body() cutTaskItemDto: CutTaskItemDto[],
    @Param('area', ParseIntPipe) areaId: number,
    @Req() req: any,
  ) {
    const userId = req.user.sub;

    return await this.taskService.reviewCutMaterials(
      cutTaskItemDto,
      areaId,
      userId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
