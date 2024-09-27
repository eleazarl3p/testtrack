import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QcService } from './qc.service';
import { TaskService } from 'src/task/task.service';
import { CutTaskItemDto } from 'src/task/dto/cut-task-item.dto';
import { TaskAreaHistoryDto } from 'src/task/dto/task-to-area.dto';
import { JobService } from 'src/job/job.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('qc')
@UseGuards(AuthGuard('jwt'))
export class QcController {
  constructor(
    private readonly qcService: QcService,
    private readonly jobService: JobService,
    private readonly taskService: TaskService,
  ) {}

  @Get('completed-tasks/:paquete')
  async completedTasks(@Param('paquete', ParseIntPipe) paqueteId: number) {
    return await this.taskService.qcCompletedTasks(paqueteId);
  }

  @Get('jobs')
  async pendingJobs() {
    const jobs = await this.jobService.findAll();

    const njbs = await Promise.all(
      jobs.map(async (jb) => {
        const paq = await Promise.all(
          jb.paquetes.map(async (pq) => {
            const materials_to_review =
              await this.taskService.recentlyCutMaterials(pq._id);

            if (materials_to_review.length) {
              return pq;
            } else {
              const tasks_to_review = await this.taskService.qcCompletedTasks(
                pq._id,
              );

              if (tasks_to_review.length) {
                return pq;
              }
            }
          }),
        );

        const filteredPaq = paq.filter(Boolean);

        if (filteredPaq.length) {
          return {
            ...jb,
            paquetes: filteredPaq,
          };
        }
      }),
    );

    const filteredJobs = njbs.filter(Boolean);

    return filteredJobs;
  }
  @Get('recently-cut-materials/:paquete')
  async recentlyCutMaterials(
    @Param('paquete', ParseIntPipe) paqueteId: number,
  ) {
    return await this.taskService.recentlyCutMaterials(paqueteId);
  }

  @Patch('review-materials/:area')
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

  @Patch('review-member/:area')
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
}
