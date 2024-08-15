import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { Member } from 'src/member/entities/member.entity';
import { Team } from 'src/team/entities/team.entity';
import { TaskItem } from './entities/task-item.entity';
import { MemberService } from 'src/member/member.service';
import { ShapeService } from 'src/shape/shape.service';
import { UpdateTaskItemDto } from './dto/update-tast-item.dto';
import { Machine } from 'src/machine/entities/machine.entity';
import { Material } from 'src/material/entities/material.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,

    @InjectRepository(TaskItem)
    private readonly taskItemRepo: Repository<TaskItem>,

    @Inject(forwardRef(() => MemberService))
    private memberService: MemberService,

    private readonly shapeService: ShapeService,
  ) {}

  async create(createTaskDto: TaskDto[]) {
    const assignedMember = [];
    const notAssignedMember = [];

    try {
      const sectionRegex = '[A-Za-z]+';
      const shapes = await this.shapeService.findAll(true);

      for (const {
        member_id,
        team_id,
        assigned,
        piecemark,
        priority,
        job_id,
      } of createTaskDto) {
        let member = undefined;

        try {
          member = await this.memberService.findOne(job_id, member_id);
          // member = await this.memberService.buildOfMaterials(
          //   paquete_id,
          //   piecemark,
          // );
        } catch (error) {
          notAssignedMember.push({
            member_id,
            piecemark,
            reason: 'Piecemark not found',
          });
          continue;
        }

        const task = new Task();
        task.member = { _id: member_id } as Member;
        task.team = { _id: team_id } as Team;
        task.quantity = assigned;
        task.priority = priority;
        const savedTask = await task.save();

        assignedMember.push({
          piecemark,
          quantity: assigned,
        });

        const machineTasks: TaskItem[] = [];
        for (const material of member.materials) {
          const materialShape = material.section.match(sectionRegex).at(0);
          const ms = shapes.find((shape) => shape.name == materialShape);

          let machineId = 1;
          if (ms.machines.length) {
            if (materialShape.toLocaleLowerCase() == 'w') {
              const depth = material.section.match('[0-9]+');
              if (depth < 36) {
                machineId = ms.machines[0]._id;
              }
            } else if (materialShape.toLocaleLowerCase() == 'l') {
              const mtrl = new Material();
              mtrl.section = material.section;
              const [d, b, t] = mtrl.dbt();
              if (d < 6 && b < 6 && t < 2.5) {
                machineId = ms.machines[0]._id;
              }
            } else if (materialShape.toLocaleLowerCase() == 'pl') {
              const m = new Material();
              m.section = material.section;
              if (m.gsr() < 2.5) {
                machineId = ms.machines[0]._id;
              }
            }
          }

          const taskMachine = new TaskItem();
          taskMachine.assigned = material.quantity * assigned;
          taskMachine.material = material;
          taskMachine.task = savedTask;
          taskMachine.machine = { _id: machineId } as Machine;
          const savedTaskMachine = await taskMachine.save();
          machineTasks.push(savedTaskMachine);
          //} else {
          //   notAssignedMember.push({
          //     piecemark,
          //     quantity: 0,
          //     reason: `No machine available to cut material : ${material.section}`,
          //   });

          //   await this.taskRepo.delete(savedTask._id);
          //   for (const mt of machineTasks) {
          //     await this.taskItemRepo.delete(mt._id);
          //   }

          //   assignedMember.pop();
          //   break;
          // }
        }
      }
    } catch (error) {
      throw error;
    }

    return { assignedMember, notAssignedMember };
  }

  async findAll() {
    return this.taskRepo.find({ relations: { team: true } });
  }

  async countCuttedMaterialOf(materialId: number) {
    const materials = await this.taskItemRepo.find({
      where: { material: { _id: materialId } },
    });
    return materials.reduce((acc, mat) => (acc += mat.cutted), 0);
  }

  async updateTaskItem(updateTaskItemDto: UpdateTaskItemDto[]) {
    try {
      for (const { _id, cutted } of updateTaskItemDto) {
        const taskItem = await this.taskItemRepo.findOne({ where: { _id } });
        if (!taskItem) {
          throw new NotFoundException();
        }

        taskItem.cutted = cutted;
        await taskItem.save();
        // console.log('done', _id);
      }
    } catch (error) {
      console.log(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
