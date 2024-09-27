import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Level } from 'src/level/entities/level.entity';
import { Team } from 'src/team/entities/team.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<User[] | null> {
    return await this.userRepo.find({
      relations: { level: { areas: true } },
    });
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: { level: { areas: true } },
    });

    if (!user) {
      throw new NotFoundException('Invalid Credentials');
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: { level: { areas: true } },
    });

    if (!user) {
      throw new NotFoundException('Invalid Credentials');
    }

    return user;
  }

  async findOneByCode(barcode: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { password: barcode },
      relations: { level: { areas: true } },
    });
  }

  async createUser(createUserDto: CreateUserDto) {
    const { password, level, team, ...userData } = createUserDto;

    const hashedPassword = await this.hashPassword(password);

    const newUser = this.userRepo.create({
      ...userData,
      password: hashedPassword,
    });
    newUser.level = level ? ({ _id: level } as Level) : null;
    newUser.team = team ? ({ _id: team } as Team) : null;
    try {
      return await this.userRepo.save(newUser);
    } catch (error) {
      throw new ConflictException(
        'Username / email already taken.\n Please try again.',
      );
    }
  }

  async updateUser(_id: number, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;

    if (password.length < 15) {
      const hashedPasword = await this.hashPassword(password);
      updateUserDto.password = hashedPasword;
    }

    try {
      await this.userRepo.update(
        { _id },
        {
          ...updateUserDto,
          level: updateUserDto.level
            ? ({ _id: updateUserDto.level } as Level)
            : null,

          team: updateUserDto.team
            ? ({ _id: updateUserDto.team } as Team)
            : null,
        },
      );
      return { message: 'user has been updated' };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
