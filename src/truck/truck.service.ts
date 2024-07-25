import { ConflictException, Injectable } from '@nestjs/common';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Truck } from './entities/truck.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TruckService {
  constructor(
    @InjectRepository(Truck)
    private readonly truckRepo: Repository<Truck>,
  ) {}
  async create(createTruckDto: CreateTruckDto) {
    try {
      const truck = this.truckRepo.create(createTruckDto);
      truck.barcode = `TR-${truck.name.padStart(5, '0')}`;
      return await truck.save();
    } catch (error) {
      throw new ConflictException();
    }
  }

  async findAll() {
    return await this.truckRepo.find();
  }

  async findOne(name: string) {
    return await this.truckRepo.findOne({ where: { name } });
  }

  async update(_id: number, updateTruckDto: UpdateTruckDto) {
    const { name } = updateTruckDto;
    return await this.truckRepo.update(
      { _id },
      { name, barcode: `TR-${name.padStart(5, '0')}` },
    );
  }

  async remove(_id: number) {
    return await this.truckRepo.delete(_id);
  }
}
