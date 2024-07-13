import { Injectable } from '@nestjs/common';
import { CreatePaqueteDto } from './dto/create-paquete.dto';
import { UpdatePaqueteDto } from './dto/update-paquete.dto';

@Injectable()
export class PaqueteService {
  create(createPaqueteDto: CreatePaqueteDto) {
    return 'This action adds a new paquete';
  }

  findAll() {
    return `This action returns all paquete`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paquete`;
  }

  update(id: number, updatePaqueteDto: UpdatePaqueteDto) {
    return `This action updates a #${id} paquete`;
  }

  remove(id: number) {
    return `This action removes a #${id} paquete`;
  }
}
