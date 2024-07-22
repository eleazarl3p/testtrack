import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepo: Repository<Contact>,
  ) {}

  async create(createContactDto: CreateContactDto) {
    try {
      const newContact = this.contactRepo.create(createContactDto);
      return await this.contactRepo.save(newContact);
    } catch (error) {
      throw new ConflictException(
        'First name is taken\nPlease try another one',
      );
    }
  }

  async findAll() {
    return await this.contactRepo.find();
  }

  async findOne(_id: number) {
    try {
      return await this.contactRepo.findOneByOrFail({ _id });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async findOneByPhone(first_name: string) {
    try {
      return await this.contactRepo.findOneByOrFail({ first_name });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async update(_id: number, updateContactDto: UpdateContactDto) {
    console.log(updateContactDto);
    return await this.contactRepo.update({ _id }, { ...updateContactDto });
  }

  async remove(_id: number) {
    return await this.contactRepo.softDelete(_id);
  }
}
