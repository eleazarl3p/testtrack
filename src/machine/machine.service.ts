import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findAll() {
    const machines = await this.machineRepo.find({
      relations: {
        tasks_items: { task: { member: { paquete: true } } },
      },
    });

    return machines.map((machine) => {
      const paquetes = {};
      machine.tasks_items.forEach((ti) => {
        if (ti.assigned > ti.cutted) {
          paquetes[ti.task.member.paquete._id] = ti.task.member.paquete.name;
        }
      });

      return {
        _id: machine._id,
        image: machine.image,
        name: machine.name,
        paquetes,
        shapes: machine.shapes,
      };
    });
  }

  async findOne(_id: number) {
    const machine = await this.machineRepo.findOne({
      where: { _id },
      relations: {
        tasks_items: { task: true },
      },
      order: { tasks_items: { task: { priority: 'ASC' } } },
    });

    return {
      _id: machine._id,
      image: machine.image,
      name: machine.name,
      shape: machine.shapes,
      items: machine.tasks_items.map((ti) => {
        return {
          id: ti._id,
          assigned: ti.assigned,
          cutted: ti.cutted,
          priority: ti.task.priority,
        };
      }),
    };
  }

  async update(_id: number, updateMachineDto: UpdateMachineDto) {
    const { shapes, name } = updateMachineDto;

    const machine = await this.machineRepo.findOne({ where: { _id } });

    machine.shapes = [];
    shapes.forEach((sh) => {
      machine.shapes.push({ _id: sh._id } as Shape);
    });

    machine.name = name;

    return await machine.save();
  }

  async tasks(_id: number, paquete_id: number, pending: boolean = false) {
    const machine = await this.machineRepo.findOne({
      where: {
        _id,
        tasks_items: {
          task: { member: { paquete: { _id: paquete_id } } },
        },
      },
      relations: {
        tasks_items: {
          material: true,
          task: true,
        },
      },
    });

    if (!machine) {
      throw new NotFoundException();
    }

    const tasks = machine.tasks_items.map((ti) => {
      return {
        _id: ti._id,
        assigned: ti.assigned,
        cutted: ti.cutted,
        material: ti.material,
        priority: ti.task.priority,
      };
    });

    if (pending) {
      return tasks.filter((tk) => tk.assigned > tk.cutted);
    }
    return tasks;
  }

  async remove(_id: number) {
    return await this.machineRepo.delete(_id);
  }
}
