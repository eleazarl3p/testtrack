import { Module } from '@nestjs/common';
import { PaqueteService } from './paquete.service';
import { PaqueteController } from './paquete.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paquete } from './entities/paquete.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Paquete])],
  controllers: [PaqueteController],
  providers: [PaqueteService],
})
export class PaqueteModule {}
