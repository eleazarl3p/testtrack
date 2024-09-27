import { Module } from '@nestjs/common';
import { QcService } from './qc.service';
import { QcController } from './qc.controller';
import { TaskModule } from 'src/task/task.module';
import { JobModule } from 'src/job/job.module';

@Module({
  imports: [TaskModule, JobModule],
  controllers: [QcController],
  providers: [QcService],
})
export class QcModule {}
