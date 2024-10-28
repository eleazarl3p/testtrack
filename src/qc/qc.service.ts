import { Injectable } from '@nestjs/common';
import { JobService } from 'src/job/job.service';
import { TaskService } from 'src/task/task.service';
import { RFDto } from './dto/rf.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MaterialInspection,
  MemberInspection,
} from './entity/inspection.entity';
import { Repository } from 'typeorm';
import { SpecialUser } from 'src/specialuser/entity/special-user.entity';
import { InspectionCriteria } from './entity/inspection-criteria.entity';

@Injectable()
export class QcService {
  constructor(
    @InjectRepository(MaterialInspection)
    private readonly matInsRepo: Repository<MaterialInspection>,

    @InjectRepository(MemberInspection)
    private readonly memInsRepo: Repository<MemberInspection>,

    @InjectRepository(InspectionCriteria)
    private readonly inspectionCriteriaRepo: Repository<InspectionCriteria>,

    private readonly jobService: JobService,
    private readonly taskService: TaskService,
  ) {}

  async pendingJobs() {
    const jobs = await this.jobService.findAll();

    const njbs = await Promise.all(
      jobs.map(async (jb) => {
        const paq = await Promise.all(
          jb.paquetes.map(async (pq) => {
            const materials_to_review =
              await this.taskService.recentlyCutMaterials(pq._id);

            if (materials_to_review.length) {
              return pq;
            } else {
              const tasks_to_review = await this.taskService.qcCompletedTasks(
                pq._id,
              );

              if (tasks_to_review.length) {
                return pq;
              }
            }
          }),
        );

        const filteredPaq = paq.filter(Boolean);

        if (filteredPaq.length) {
          return {
            ...jb,
            paquetes: filteredPaq,
          };
        }
      }),
    );

    const filteredJobs = njbs.filter(Boolean);

    return filteredJobs;
  }

  async failedJobs() {
    const jobs = await this.jobService.findAll();

    const njbs = await Promise.all(
      jobs.map(async (jb) => {
        const paq = await Promise.all(
          jb.paquetes
            .map(async (pq) => {
              const materials_to_review =
                await this.taskService.failedCutMaterials(pq._id);

              if (materials_to_review.length) {
                return pq;
              } else {
                const tasks_to_review = await this.taskService.qcFailedTasks(
                  pq._id,
                );

                if (tasks_to_review.length) {
                  return pq;
                }
              }
            })
            .filter(Boolean),
        );

        const filteredPaq = paq.filter(Boolean);

        if (filteredPaq.length) {
          return {
            ...jb,
            paquetes: filteredPaq,
          };
        }
      }),
    );

    const filteredJobs = njbs.filter(Boolean);

    return filteredJobs;
  }

  async submitFormTaskItem(rfDto: RFDto, userId: number) {
    const { criteria_answers, photos, ids, inspector, fabricator, ...rest } =
      rfDto;

    for (const _id of ids) {
      try {
        const mainsp = this.matInsRepo.create({
          ...rest,
          inspector: { _id: inspector._id } as SpecialUser,
          fabricator: { _id: fabricator._id } as SpecialUser,
        });

        const toSaveAnswer = [];
        for (const cia of criteria_answers) {
          const ipc = this.inspectionCriteriaRepo.create({
            criteria: { _id: cia.criteria._id },
            answer: cia.answer,
          });

          toSaveAnswer.push(ipc);
        }

        const crAns = await this.inspectionCriteriaRepo.save(toSaveAnswer);
        mainsp.criteriaAnswers = crAns;

        const inspection = await this.matInsRepo.save(mainsp);

        await this.taskService.qcInspectCutHistory(_id, inspection);
      } catch (error) {
        console.log(error);
      }
    }
  }
}
