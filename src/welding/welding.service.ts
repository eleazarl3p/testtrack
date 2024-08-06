import { Injectable } from '@nestjs/common';
import { CreateWeldingDto } from './dto/create-welding.dto';
import { UpdateWeldingDto } from './dto/update-welding.dto';

@Injectable()
export class WeldingService {
  create(createWeldingDto: CreateWeldingDto) {
    return 'This action adds a new welding';
  }

  findAll() {
    return `This action returns all welding`;
  }

  findOne(id: number) {
    return `This action returns a #${id} welding`;
  }

  update(id: number, updateWeldingDto: UpdateWeldingDto) {
    return `This action updates a #${id} welding`;
  }

  remove(id: number) {
    return `This action removes a #${id} welding`;
  }
}
