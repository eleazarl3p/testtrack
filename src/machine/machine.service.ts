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
      // relations: {
      //   tasks_items: { task: { member: { paquete: true } } },
      // },
      // order: {
      //   tasks_items: { task: { member: { paquete: { name: 'ASC' } } } },
      // },
    });

    return machines;
    // return machines.map((machine) => {
    //   const paquetes = {};
    //   machine.tasks_items.forEach((ti) => {
    //     paquetes[ti.task.member.paquete._id] = ti.task.member.paquete.name;
    //   });

    //   return {
    //     _id: machine._id,
    //     image: machine.image,
    //     name: machine.name,
    //     paquetes,
    //     shapes: machine.shapes,
    //   };
    // });
  }

  // async findOne(_id: number) {
  //   const machine = await this.machineRepo.findOne({
  //     where: { _id },
  //     relations: {
  //       tasks_items: { task: true, material: true },
  //     },
  //     order: { tasks_items: { task: { expected_date: 'ASC' } } },
  //   });

  //   return {
  //     _id: machine._id,
  //     image: machine.image,
  //     name: machine.name,
  //     shape: machine.shapes,
  //     items: machine.tasks_items.map((ti) => {
  //       return {
  //         id: ti._id,
  //         material: ti.material,
  //         assigned: ti.assigned,
  //         cut: ti.cut_history.reduce((acc, cut) => (acc += cut.cut), 0),
  //         approved: ti.cut_history.reduce((acc, cut) => (acc += cut.approved), 0),
  //         expected_date: ti.task.expected_date.toISOString(),
  //       };
  //     }),
  //   };
  // }

  async update(_id: number, updateMachineDto: UpdateMachineDto) {
    const { shapes, name, rank } = updateMachineDto;

    const machine = await this.machineRepo.findOne({ where: { _id } });

    machine.shapes = [];
    shapes.forEach((sh) => {
      machine.shapes.push({ _id: sh._id } as Shape);
    });

    machine.name = name;
    machine.rank = rank;

    return await machine.save();
  }

  async tasks(id: number, paquete_id: number, pending: boolean = false) {
    const machine = await this.machineRepo.findOne({
      where: {
        _id: id,
        tasks_items: {
          task: {
            member: { paquete: { _id: paquete_id } },
            items: { machine: { _id: id } },
          },
        },
      },
      relations: {
        tasks_items: {
          material: true,
          task: { team: true },
          cut_history: true,
        },
      },
    });

    if (!machine) {
      throw new NotFoundException();
    }
    return machine;
    const tasks = machine.tasks_items.map((ti) => {
      ti.material['quantity'] = ti.assigned;
      ti.material['cut_history'] = ti.cut_history.map((ct) => {
        return {
          ...ct,
          user: '...',
        };
      });
      return {
        _id: ti._id,
        expected_date: ti.task.expected_date,
        material: ti.material,
      };
    });

    if (pending) {
      return tasks
        .map((t) => {
          const totCut = t.material['cut_history'].reduce(
            (acc: number, c: { cut: any }) => (acc += c.cut),
            0,
          );

          if (t.material['quantity'] > totCut) {
            return t;
          }
        })
        .filter(Boolean);
    }

    return tasks;
  }

  async remove(_id: number) {
    return await this.machineRepo.delete(_id);
  }
}
