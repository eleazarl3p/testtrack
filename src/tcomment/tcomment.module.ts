import { Module } from '@nestjs/common';
import { TcommentService } from './tcomment.service';
import { TcommentController } from './tcomment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tcomment } from './entities/tcomment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tcomment])],
  controllers: [TcommentController],
  providers: [TcommentService],
})
export class TcommentModule {}
