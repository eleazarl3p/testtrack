import { Injectable, NotFoundException } from '@nestjs/common';
import { Job } from './entites/job.entity';
import { BaseEntity, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
  ) {}

  async findById(_id: number): Promise<Job> {
    return await this.jobRepo.findOneOrFail({
      where: { _id },
      relations: { paquetes: true },
    });
  }

  async create(createJobDto: CreateJobDto): Promise<Job | null> {
    const md = this.jobRepo.create(createJobDto);
    try {
      return await this.jobRepo.save(md);
    } catch (error) {
      return null;
    }
  }

  async find(job_name: string): Promise<Job> {
    return await this.jobRepo.findOneBy({ job_name });
  }

  async findAll() {
    const modelos = await this.jobRepo.find({
      relations: { paquetes: true, installer: true, gc: true },
    });

    return modelos;
  }

  async getBarcode(job_name: string): Promise<string[]> {
    try {
      const modelo = await this.jobRepo.findOneByOrFail({ job_name });
      return [modelo.barcode];
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async update(_id: number, updateModelDto: any) {
    const { installer, gc, ...job } = updateModelDto;

    return await this.jobRepo.update(
      { _id },
      {
        installer: { _id: installer == null ? null : installer._id },
        gc: { _id: gc == null ? null : gc._id },
        ...job,
      },
    );
  }

  async delete(_id: number) {
    try {
      return this.jobRepo.softDelete(_id);
    } catch (error) {}
  }
}
