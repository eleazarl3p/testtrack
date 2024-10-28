import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  Request,
} from '@nestjs/common';
import { QcService } from './qc.service';

import { CutTaskItemDto } from 'src/task/dto/cut-task-item.dto';
import { TaskAreaHistoryDto } from 'src/task/dto/task-to-area.dto';

import { AuthGuard } from '@nestjs/passport';
import { TaskService } from 'src/task/task.service';
import { RFDto } from './dto/rf.dto';

@Controller('qc')
@UseGuards(AuthGuard('jwt'))
export class QcController {
  constructor(
    private readonly qcService: QcService,
    private readonly taskService: TaskService,
  ) {}

  @Get('completed-tasks/:paquete')
  async completedTasks(@Param('paquete', ParseIntPipe) paqueteId: number) {
    return await this.taskService.qcCompletedTasks(paqueteId);
  }

  @Get('job/pending')
  async pendingJobs() {
    const t = await this.qcService.pendingJobs();
    return t;
  }

  @Get('job/failed')
  async failedJobs() {
    return await this.qcService.failedJobs();
  }

  // Materials from Cutting area that QC needs to check
  @Get('recently-cut-materials/:paquete')
  async recentlyCutMaterials(
    @Param('paquete', ParseIntPipe) paqueteId: number,
  ) {
    return await this.taskService.recentlyCutMaterials(paqueteId);
  }

  // QC sends verified materials to an area
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

  // QC verify member from an area
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

  // QC get list of failed materials
  @Get('failed-cut-materials/:paquete')
  async failedMaterials(@Param('paquete', ParseIntPipe) paqueteId: number) {
    return this.taskService.failedCutMaterials(paqueteId);
  }

  // QC send report
  @Post('submit-form')
  submitFormReview(
    @Query('piecemarks') piecemarks: string,
    @Body() rfDto: RFDto,
    @Request() req: any,
  ) {
    if (piecemarks == 'materials') {
      const userId = req.user.sub;

      return this.qcService.submitFormTaskItem(rfDto, userId);
    } else if (piecemarks == 'members') {
      console.log('member');
    }
  }

  @Get('reports/:paquete')
  reports(@Param('paquete', ParseIntPipe) paqueteId: number) {
    return this.taskService.reports(paqueteId);
  }

  // QC update report
  @Patch('report/:id')
  updateReport(
    @Param('id', ParseIntPipe) reportId: number,
    @Body() rfDto: RFDto,
    @Request() req: any,
  ) {
    const userId = req.user.sub;
    return this.taskService.updateReport(reportId, rfDto, userId);
  }
}
