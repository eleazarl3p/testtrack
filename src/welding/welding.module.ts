import { Module } from '@nestjs/common';
import { WeldingService } from './welding.service';
import { WeldingController } from './welding.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Welding } from './entities/welding.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Welding])],
  controllers: [WeldingController],
  providers: [WeldingService],
})
export class WeldingModule {}
