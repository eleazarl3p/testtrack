import { forwardRef, Inject, Injectable } from '@nestjs/common';
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
import { CutItemDto, CutTaskItemDto } from './dto/cut-task-item.dto';
import { Machine } from 'src/machine/entities/machine.entity';
import { Material } from 'src/material/entities/material.entity';
import { CutHistory } from './entities/cut-history.entity';
import { User } from 'src/user/entities/user.entity';
import { TaskAreaHistoryDto, TaskToAreaDto } from './dto/task-to-area.dto';
import { TaskArea } from './entities/taskarea.entity';
import { Area } from 'src/area/entities/area.entity';
import { TaskAreaHistory } from './entities/taskarea-history';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,

    @InjectRepository(TaskItem)
    private readonly taskItemRepo: Repository<TaskItem>,

    @InjectRepository(CutHistory)
    private readonly cutHistoryRepo: Repository<CutHistory>,

    @InjectRepository(TaskArea)
    private readonly taskAreaRepo: Repository<TaskArea>,

    @InjectRepository(TaskAreaHistory)
    private readonly taskAreaHistoryRepo: Repository<TaskAreaHistory>,

    @Inject(forwardRef(() => MemberService))
    private memberService: MemberService,

    private readonly shapeService: ShapeService,
  ) {}

  calculateDate(delta: number) {
    const currentDate = new Date();

    const localCurrentDate = new Date(
      currentDate.getTime() - currentDate.getTimezoneOffset() * 60 * 1000,
    );

    return new Date(localCurrentDate.getTime() + delta * 24 * 60 * 60 * 1000);
  }

  async create(createTaskDto: TaskDto[]) {
    const assignedMember = {} as Record<string, any>;
    const notAssignedMember = [];

    try {
      const sectionRegex = '[A-Za-z]+';
      const shapes = await this.shapeService.findAll(true);

      for (const {
        member_id,
        team_id,
        assigned,
        piecemark,
        date_delta,
      } of createTaskDto) {
        const member = await this.memberService.findMember(member_id);

        if (!member) {
          notAssignedMember.push({
            member_id,
            piecemark,
            reason: 'Piecemark not found',
          });
          continue;
        }

        for (let i = 0; i < assigned; i++) {
          const task = new Task();
          task.member = { _id: member_id } as Member;
          task.team = { _id: team_id } as Team;

          task.expected_date = this.calculateDate(date_delta);
          task.estimated_date = task.expected_date;

          const savedTask = await task.save();

          if (!assignedMember[piecemark]) {
            assignedMember[piecemark] = {
              piecemark,
              quantity: 0,
            };
          }

          assignedMember[piecemark].quantity += 1;
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
                if (d < 6 && b < 6 && t < 0.51) {
                  machineId = ms.machines[0]._id;
                }
              } else if (materialShape.toLocaleLowerCase() == 'pl') {
                const m = new Material();
                m.section = material.section;
                if (m.gsr() < 2.51) {
                  machineId = ms.machines[0]._id;
                }
              }
            }

            const taskMachine = new TaskItem();
            taskMachine.assigned = material.quantity;
            taskMachine.material = material;
            taskMachine.task = savedTask;
            taskMachine.machine = { _id: machineId } as Machine;
            const savedTaskMachine = await taskMachine.save();
            machineTasks.push(savedTaskMachine);
          }
        }
      }
    } catch (error) {
      throw error;
    }

    return { assignedMember: Object.values(assignedMember), notAssignedMember };
  }

  async cutTaskItems(cutItemDtos: CutItemDto[], userId: number) {
    for (const { _id, quantity } of cutItemDtos) {
      try {
        const cutting = this.cutHistoryRepo.create({ quantity });
        cutting.task_item = { _id } as TaskItem;
        cutting.user = { _id: userId } as User;

        await cutting.save();
      } catch (error) {
        console.log('error cut material', error);
      }
    }

    return 'successfully cut';
  }

  formatTasksArea(tasks: TaskArea[]): any {
    return tasks.map((tsk) => {
      return {
        _id: tsk._id,
        expected_date: tsk.task.expected_date,
        team: tsk.task.team.name,
        task_id: tsk.task._id,
        member: {
          ...tsk.task.member,
          quantity: 1,
          materials: tsk.task.items.map((it) => {
            return {
              ...it.material,
              quantity: it.assigned,
              cut_history: it.cut_history.map((h) => {
                return {
                  ...h,
                  user: h.user.fullname(),
                };
              }),
            };
          }),
          areas: [],
        },
        history: tsk.task.task_area.flatMap((ta) => ta.history),
      };
    });
  }

  formatTaskItems(items: TaskItem[]) {
    return items.map((item) => {
      return {
        _id: item._id,
        assigned: 1, //item.task.member.quantity,
        expected_date: item.task.expected_date,
        team: item.task.team.name,
        task_id: item.task._id,
        //task_quantity: item.task.quantity,
        member: {
          ...item.task.member,
          quantity: 1, //item.task.quantity,
          // weight: 0,
          materials: [
            {
              ...item.material,
              quantity: item.assigned,
              cut_history: item.cut_history.map((h) => {
                return {
                  ...h,
                  user: h.user.fullname(),
                };
              }),
            },
          ],
          areas: [],
        },
        machine: item.machine.name,
      };
    });
  }

  async pendingTaskArea(areaId: number, paqueteId: number, all: boolean) {
    const tasks = await this.taskAreaRepo.find({
      where: {
        area: { _id: areaId },
        task: {
          task_area: { area: { _id: areaId } },
          member: { paquete: { _id: paqueteId } },
        },
      },
      relations: {
        task: {
          member: true,
          team: true,
          items: { material: true, cut_history: { user: true } },
          task_area: { history: true },
        },
      },
    });

    //return tasks;
    const formatedTasks = this.formatTasksArea(tasks);

    return formatedTasks.filter((ft) => {
      const notCompleted = ft.history.some(
        (h: { completed: number }) => h.completed == 0,
      );
      console.log(notCompleted, ft.history.length);
      if (notCompleted || ft.history.length == 0) {
        return ft;
      }
    });
    //   if (notCompleted) {
    //     return ft;
    //   }
    // });
    // .filter((ft: { history: any[]; member: { quantity: number } }) => {
    //   const totCompleted = ft.history.reduce(
    //     (acc, h) => (acc += h.completed),
    //     0,
    //   );

    //   if (ft.member.quantity > totCompleted) {
    //     return ft;
    //   }
    // })
    // .filter(Boolean);
  }

  async pendingTaskMachine(machineId: number, paqueteId: number, all: boolean) {
    const itms = await this.taskItemRepo.find({
      where: {
        machine: { _id: machineId },
        task: { member: { paquete: { _id: paqueteId } } },
      },
      relations: {
        task: { team: true, member: true },
        machine: true,
        material: true,
        cut_history: { user: true },
      },
    });

    const tasks = this.formatTaskItems(itms);
    // return tasks.filter((t) => t.member.piecemark == '13B1');
    if (all) return tasks;
    return tasks
      .map((tsk) => {
        const totalCut = tsk.member.materials[0].cut_history.reduce(
          (acc, c) => (acc += c.quantity),
          0,
        );

        if (tsk.member.materials[0].quantity > totalCut) {
          return tsk;
        }
      })
      .filter(Boolean);
  }

  async recentlyCutMaterials(paqueteId: number) {
    const items = await this.taskItemRepo.find({
      where: {
        task: { member: { paquete: { _id: paqueteId } } },
      },
      relations: {
        task: { team: true, member: true },
        machine: true,
        material: true,
        cut_history: { user: true },
      },
    });

    const taskItems = this.formatTaskItems(items);

    return taskItems
      .map((taks) => {
        const toBeApproved = taks.member.materials[0].cut_history.filter(
          (ch) => ch.approved == null,
        );

        if (toBeApproved.length) {
          taks.member.materials[0].cut_history = toBeApproved;
          taks.member.materials[0].quantity = toBeApproved.reduce(
            (acc, c) => (acc += c.quantity),
            0,
          );
          return taks;
        }
      })
      .filter(Boolean);
  }

  async qcCompletedTasks(paqueteId: number) {
    const tasks = await this.taskAreaHistoryRepo.find({
      where: {
        task_area: { task: { member: { paquete: { _id: paqueteId } } } },
      },
      relations: {
        task_area: {
          area: true,
          task: {
            member: true,
            team: true,
            items: { material: true, cut_history: { user: true } },
          },
        },
      },
    });

    const filteredTasks = tasks.filter(
      (th) => th.approved == null && th.completed > 0,
    );

    return filteredTasks.map((th) => {
      return {
        _id: th._id,
        expected_date: th.task_area.task.expected_date,
        area: th.task_area.area.name,
        team: th.task_area.task.team.name,
        task_id: th.task_area.task._id,
        member: {
          ...th.task_area.task.member,
          quantity: 1, //th.completed,
          materials: th.task_area.task.items.map((it) => {
            return {
              ...it.material,
              quantity: it.assigned,
              cut_history: it.cut_history.map((h) => {
                return {
                  ...h,
                  user: h.user.fullname(),
                };
              }),
            };
          }),
          areas: [],
        },
      };
    });
  }

  async qcReviewCutMaterials(
    cutTaskItemDtos: CutTaskItemDto[],
    areaId: number,
    userId: number,
  ) {
    for (const { task_id, cutDtos } of cutTaskItemDtos) {
      if (cutDtos.some((item) => item.quantity > 0)) {
        try {
          const toArea = this.taskAreaRepo.create({
            //assigned: task_assigned,
            area: { _id: areaId } as Area,
            task: { _id: task_id } as Task,
          });

          await toArea.save();
        } catch (error) {
          // console.log(error);
        }
      }

      for (const { _id, quantity } of cutDtos) {
        await this.cutHistoryRepo.update(
          { _id },
          { approved: quantity, reviewed_by: { _id: userId } as User },
        );
      }
    }
  }

  async qcReviewMember(
    taskAreaHistoryDto: TaskAreaHistoryDto[],
    areaId: number,
    userId: number,
  ) {
    for (const { _id, quantity, task_id } of taskAreaHistoryDto) {
      try {
        await this.taskAreaHistoryRepo.update(
          { _id },
          {
            approved: quantity > 0 ? true : false,
            reviewed_by: { _id: userId } as User,
          },
        );
        //if (quantity == 0) {
        //   const t = await this.taskAreaHistoryRepo.findOne({
        //     where: { _id },
        //     relations: { task_area: true },
        //   });

        //   if (t != null) {
        //     const newHistory = this.taskAreaHistoryRepo.create({
        //       task_area: t.task_area,
        //       user: { _id: userId } as User,
        //     });

        //     await newHistory.save();
        //   }
        // } else {
        if (quantity > 0) {
          const toArea = this.taskAreaRepo.create({
            //quantity: task_quantity,
            area: { _id: areaId } as Area,
            task: { _id: task_id } as Task,
          });

          await toArea.save();
        }
      } catch (error) {
        //console.log(error);
      }
    }
  }

  async update(updateTaskDto: UpdateTaskDto[]) {
    for (const { _id, expected_date } of updateTaskDto) {
      await this.taskRepo.update({ _id }, { expected_date });
    }
  }

  // async fullyCutTasks(paqueteId: number) {
  //   const tasks = await this.taskRepo.find({
  //     where: { member: { paquete: { _id: paqueteId } } },
  //     relations: {
  //       items: {
  //         cut_history: true,
  //         material: true,
  //       },
  //       member: { member_material: { material: true } },
  //       team: true,
  //       task_area: true,
  //     },
  //   });

  //   const formatedTasks = tasks.map((tsk) => {
  //     return {
  //       _id: tsk._id,
  //       expected_date: tsk.expected_date,
  //       assigned: tsk.quantity,
  //       team: tsk.team.name,
  //       member: {
  //         _id: tsk.member._id,
  //         idx_pcmk: tsk.member.idx_pcmk,
  //         main_material: tsk.member.main_material,
  //         piecemark: tsk.member.piecemark,
  //         barcode: tsk.member.barcode,
  //         mem_desc: tsk.member.mem_desc,
  //         quantity: tsk.quantity,
  //         //create_date: tsk.member.create_date,
  //         //weight: 0,
  //         materials: tsk.member.member_material.map((mm) => {
  //           return {
  //             ...mm.material,
  //             quantity: mm.quantity,
  //             cut_history: tsk.items
  //               .filter((it) => it.material._id == mm.material._id)
  //               .pop().cut_history,
  //           };
  //         }),
  //         areas: tsk.task_area,
  //       },
  //       machine: '',
  //     };
  //   });

  //   const Q = formatedTasks
  //     .map((ft) => {
  //       const T = [];

  //       ft.member.materials.forEach((material) => {
  //         const totCut = material.cut_history.reduce(
  //           (acc, c) => (acc += c.approved != null ? c.approved : 0),
  //           0,
  //         );

  //         const tn = Math.floor(totCut / material.quantity);
  //         T.push(tn);
  //       });

  //       if (T.length) {
  //         const fc = Math.min(...T);
  //         if (fc > 0 && ft.member.areas.length == 0) {
  //           ft.member.quantity = fc;
  //           return ft;
  //         }
  //       }
  //     })
  //     .filter(Boolean);

  //   return Q;
  // }

  async moveToArea(taskToArea: TaskToAreaDto[], userId: number) {
    for (const { _id, quantity } of taskToArea) {
      try {
        const t = await this.taskAreaHistoryRepo.findOne({
          where: { task_area: { _id }, completed: 0 },
          relations: { task_area: true },
        });

        if (t == null) {
          const toArea = this.taskAreaHistoryRepo.create({
            completed: quantity,
            task_area: { _id: _id } as Task,
            user: { _id: userId } as User,
          });
          await toArea.save();
        } else {
          await this.taskAreaHistoryRepo.update(
            { _id: t._id },
            { completed: 1 },
          );
        }
      } catch (error) {}
    }
  }
}
