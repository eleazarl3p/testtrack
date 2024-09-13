import { forwardRef, Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskItem } from './entities/task-item.entity';
import { MemberModule } from 'src/member/member.module';
import { ShapeModule } from 'src/shape/shape.module';
import { CutHistory } from './entities/cut-history.entity';
import { TaskArea } from './entities/taskarea.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, TaskItem, CutHistory, TaskArea]),
    forwardRef(() => MemberModule),
    ShapeModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
