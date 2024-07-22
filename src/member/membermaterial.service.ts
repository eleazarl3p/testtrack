import { InjectRepository } from '@nestjs/typeorm';
import { MemberMaterial } from './entities/membermaterial.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MemberMaterialService {
  constructor(
    @InjectRepository(MemberMaterial)
    private readonly mmRepo: Repository<MemberMaterial>,
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
    const materials = await this.mmRepo.find({
      where: { material_id },
      relations: { material: true },
    });

    const updatedMaterials = {};
    materials.map((mat) => {
      if (!updatedMaterials[mat.material._id]) {
        updatedMaterials[mat.material._id] = {
          ...mat.material,
          quantity: 0,
          cuted: 0,
        };
      }

      updatedMaterials[mat.material._id].quantity += mat.quantity;
      updatedMaterials[mat.material._id].cuted += mat.cuted;
    });

    return updatedMaterials[material_id];
  }
}
