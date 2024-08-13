import { Injectable } from '@nestjs/common';
import { CreateTcommentDto } from './dto/create-tcomment.dto';
import { UpdateTcommentDto } from './dto/update-tcomment.dto';

@Injectable()
export class TcommentService {
  create(createTcommentDto: CreateTcommentDto) {
    return 'This action adds a new tcomment';
  }

  findAll() {
    return `This action returns all tcomment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tcomment`;
  }

  update(id: number, updateTcommentDto: UpdateTcommentDto) {
    return `This action updates a #${id} tcomment`;
  }

  remove(id: number) {
    return `This action removes a #${id} tcomment`;
  }
}
