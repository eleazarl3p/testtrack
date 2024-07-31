import { PartialType } from '@nestjs/swagger';
import { TaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(TaskDto) {}
