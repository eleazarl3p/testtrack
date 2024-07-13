import { ConflictException, Injectable } from '@nestjs/common';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Material } from './entities/material.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepo: Repository<Material>,
  ) {}

  async create(createMaterialDto: CreateMaterialDto) {
    try {
      const newMaterial = this.materialRepo.create(createMaterialDto);
      newMaterial.barcode = 'W11125-' + newMaterial.piecemark;
      return await this.materialRepo.save(newMaterial);
    } catch (error) {
      console.log(error.code);
      throw new ConflictException();
    }
  }

  findAll() {
    return this.materialRepo.find({ relations: { members: true } });
  }

  findOne(id: number) {
    return `This action returns a #${id} material`;
  }

  findOneByPiecemark(piecemark: string) {
    return this.materialRepo.findOne({
      where: { piecemark },
      relations: { members: true },
    });
  }

  update(id: number, updateMaterialDto: UpdateMaterialDto) {
    return `This action updates a #${id} material`;
  }

  remove(id: number) {
    return `This action removes a #${id} material`;
  }
}
