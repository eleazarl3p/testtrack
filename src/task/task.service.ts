import { Injectable } from '@nestjs/common';
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

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,

    @InjectRepository(TaskItem)
    private readonly taskItemRepo: Repository<TaskItem>,

    private readonly memberService: MemberService,

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
        paquete_id,
        priority,
      } of createTaskDto) {
        let member = undefined;

        try {
          member = await this.memberService.buildOfMaterials(
            paquete_id,
            piecemark,
          );
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

          if (ms) {
            const taskMachine = new TaskItem();
            taskMachine.assigned = material.quantity * assigned;
            taskMachine.material = material;
            taskMachine.task = savedTask;
            taskMachine.machine = ms.machines[0];
            const savedTaskMachine = await taskMachine.save();
            machineTasks.push(savedTaskMachine);
          } else {
            // notAssignedMaterial.push({
            //   piecemark,
            //   material: { _id: material._id, section: material.section },
            // });
            notAssignedMember.push({
              piecemark,
              quantity: 0,
              reason: `No machine available to cut materila : ${material.section}`,
            });

            await this.taskRepo.delete(savedTask._id);
            for (const mt of machineTasks) {
              await this.taskItemRepo.delete(mt._id);
            }

            assignedMember.pop();
            break;
          }
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
