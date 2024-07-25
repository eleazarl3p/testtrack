import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Machine } from './entities/machine.entity';
import { Repository } from 'typeorm';
import { Shape } from 'src/shape/entities/shape.entity';

@Injectable()
export class MachineService {
  constructor(
    @InjectRepository(Machine)
    private readonly machineRepo: Repository<Machine>,
  ) {}

  async create(createMachineDto: CreateMachineDto) {
    const { shapes, ...machineDto } = createMachineDto;
    try {
      const savedMachine = await this.machineRepo.save(machineDto);
      const machine = await this.machineRepo.findOne({
        where: { _id: savedMachine._id },
        relations: { shapes: true },
      });
      shapes.forEach((sh) => {
        machine.shapes.push({ _id: sh._id } as Shape);
      });
      return await machine.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findAll() {
    return this.machineRepo.find();
  }

  async findOne(_id: number) {
    return await this.machineRepo.findOne({ where: { _id } });
  }

  async update(_id: number, updateMachineDto: UpdateMachineDto) {
    const { shapes, name } = updateMachineDto;

    const machine = await this.findOne(_id);

    machine.shapes = [];
    shapes.forEach((sh) => {
      machine.shapes.push({ _id: sh._id } as Shape);
    });

    machine.name = name;

    return await machine.save();
  }

  async remove(_id: number) {
    return await this.machineRepo.delete(_id);
  }
}
