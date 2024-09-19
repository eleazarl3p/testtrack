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
import { CutItemDto, CutTaskItemDto } from './dto/cut-task-item.dto';
import { AuthGuard } from '@nestjs/passport';
import { TaskAreaHistoryDto, TaskToAreaDto } from './dto/task-to-area.dto';

@Controller('task')
@UseGuards(AuthGuard('jwt'))
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body(new CustomTaskValitationPipe()) tasks: TaskDto[]) {
    return this.taskService.create(tasks);
  }

  @Post('area/to-qc/')
  async moveToArea(@Body() taskToAreaDto: TaskToAreaDto[], @Req() req: any) {
    const userId = req.user.sub;
    return await this.taskService.moveToArea(taskToAreaDto, userId);
  }

  @Get('area/pending-tasks/:area/:paquete')
  pendingTaskArea(
    @Param('area', ParseIntPipe) areaId: number,
    @Param('paquete', ParseIntPipe) paqueteId: number,
    @Query('all', ParseBoolPipe) all: boolean,
  ) {
    return this.taskService.pendingTaskArea(areaId, paqueteId, all);
  }

  @Post('machine/cut-materials')
  async cutTaskItems(@Body() cutItemDto: CutItemDto[], @Req() req: any) {
    const userId = req.user.sub;
    // console.log(userId);
    return await this.taskService.cutTaskItems(cutItemDto, userId);
  }

  @Get('machine/pending-tasks/:machine/:paquete')
  pendingTaskMachine(
    @Param('machine', ParseIntPipe) machineId: number,
    @Param('paquete', ParseIntPipe) paqueteId: number,
    @Query('all', ParseBoolPipe) all: boolean,
  ) {
    return this.taskService.pendingTaskMachine(machineId, paqueteId, all);
  }

  @Get('qc/recently-cut-materials/:paquete')
  async recentlyCutMaterials(
    @Param('paquete', ParseIntPipe) paqueteId: number,
  ) {
    return await this.taskService.recentlyCutMaterials(paqueteId);
  }

  @Get('qc/completed-tasks/:paquete')
  async completedTasks(@Param('paquete', ParseIntPipe) paqueteId: number) {
    return await this.taskService.qcCompletedTasks(paqueteId);
  }

  @Patch('qc/review-materials/:area')
  async reviewCutMaterials(
    @Body() cutTaskItemDto: CutTaskItemDto[],
    @Param('area', ParseIntPipe) areaId: number,
    @Req() req: any,
  ) {
    const userId = req.user.sub;

    return await this.taskService.qcReviewCutMaterials(
      cutTaskItemDto,
      areaId,
      userId,
    );
  }

  @Patch('qc/review-member/:area')
  async reviewMember(
    @Body() taskAreaHistoryDto: TaskAreaHistoryDto[],
    @Param('area', ParseIntPipe) areaId: number,
    @Req() req: any,
  ) {
    const userId = req.user.sub;

    return await this.taskService.qcReviewMember(
      taskAreaHistoryDto,
      areaId,
      userId,
    );
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
}
