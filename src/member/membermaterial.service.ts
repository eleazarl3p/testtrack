import { InjectRepository } from '@nestjs/typeorm';
import { MemberMaterial } from './entities/membermaterial.entity';
import { Repository } from 'typeorm';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { TaskService } from 'src/task/task.service';

@Injectable()
export class MemberMaterialService {
  constructor(
    @InjectRepository(MemberMaterial)
    private readonly mmRepo: Repository<MemberMaterial>,

    @Inject(forwardRef(() => TaskService))
    private taskService: TaskService,
  ) {}

  async create(mm: MemberMaterial) {
    return this.mmRepo.save(mm);
  }

  async findOne(
    member_id: number,
    material_id: number,
  ): Promise<MemberMaterial> {
    return await this.mmRepo.findOne({ where: { member_id, material_id } });
  }

  async getWeight(member_id: number) {
    const materials = await this.mmRepo.find({
      where: { member_id },
      relations: { material: true },
    });

    return materials.reduce(
      (total, mm) => total + mm.quantity * mm.material.weight,
      0,
    );
  }

  async countMaterials(material_id: number) {
    const mbmtrl = await this.mmRepo.find({
      where: { material_id },
      relations: { member: true, material: true },
    });

    const materials = mbmtrl.map((mm) => {
      return {
        ...mm.material,
        quantity: mm.quantity * mm.member.quantity,
      };
    });

    const material = materials.reduce((acc, item) => {
      if (!acc) {
        return { ...item };
      }
      return {
        ...acc,
        quantity: acc.quantity + item.quantity,
      };
    }, null);

    const { last_update, cut } = await this.taskService.countCutMaterialOf(
      material._id,
    );

    return {
      ...material,
      cut,
      last_update,
    };
  }
}
