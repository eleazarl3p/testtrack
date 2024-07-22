import { ConflictException, Injectable } from '@nestjs/common';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Material } from './entities/material.entity';
import { Repository } from 'typeorm';
import { MemberMaterialService } from 'src/member/membermaterial.service';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepo: Repository<Material>,

    private readonly mmService: MemberMaterialService,
  ) {}

  async create(createMaterialDto: CreateMaterialDto) {
    try {
      return this.materialRepo.save(createMaterialDto);
      // newMaterial.barcode = `W${}-${newMaterial.piecemark.padStart(5, '0')}`;
      // return await this.materialRepo.save(newMaterial);
    } catch (error) {
      console.log(error.code);
      throw new ConflictException();
    }
  }

  async findAll() {
    const materials = await this.materialRepo.find();

    const m = await Promise.all(
      materials.map(async (mat) => {
        return await this.mmService.countMaterials(mat._id);
      }),
    );

    return m;
  }

  async findOne(piecemark: string, job_name: string) {
    const material = await this.findOneByPiecemarkAndBarcode(
      piecemark,
      job_name,
    );

    return await this.mmService.countMaterials(material._id);
  }

  // findOneByPiecemark(piecemark: string) {
  //   return this.materialRepo.findOne({
  //     where: { piecemark },
  //   });
  // }

  async findOneByPiecemarkAndBarcode(
    piecemark: string,
    job_name: string,
  ): Promise<Material> {
    return await this.materialRepo
      .createQueryBuilder('material')
      .where('material.piecemark = :piecemark', { piecemark })
      .andWhere('material.barcode LIKE :job_name', {
        job_name: `%${job_name}%`,
      })
      .getOne();
  }

  async getBarcodesByPaquete(paqueteId: number): Promise<string[]> {
    const barcodes = await this.materialRepo
      .createQueryBuilder('material')
      .innerJoin('material.member_material', 'member_material')
      .innerJoin('member_material.member', 'member')
      .where('member.paquete_id = :paqueteId', { paqueteId })
      .select('material.barcode')
      .getRawMany();

    return barcodes.map((result) => result.material_barcode);
  }
}
