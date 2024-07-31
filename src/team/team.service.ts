import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepo: Repository<Team>,
  ) {}
  async create(createTeamDto: CreateTeamDto) {
    try {
      return await this.teamRepo.save(createTeamDto);
    } catch (error) {
      throw new ConflictException('Duplicate team name is not alloewd');
    }
  }

  alphabeticalOrder(teams: Team[]) {
    return teams.sort((a, b) => {
      const matchA = a.name.match(/^([A-Za-z]+)(\d+)?$/);
      const matchB = b.name.match(/^([A-Za-z]+)(\d+)?$/);

      const prefixA = matchA[1];
      const prefixB = matchB[1];

      const numA = matchA[2] ? parseInt(matchA[2]) : NaN;
      const numB = matchB[2] ? parseInt(matchB[2]) : NaN;

      // Compare prefixes alphabetically
      if (prefixA !== prefixB) {
        return prefixA.localeCompare(prefixB);
      }

      // If prefixes are the same, compare numeric parts
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }

      // If only one has a numeric part, the non-numeric one comes first
      if (isNaN(numA) && !isNaN(numB)) {
        return -1;
      }
      if (!isNaN(numA) && isNaN(numB)) {
        return 1;
      }

      // If neither has a numeric part, they are equal in terms of sorting
      return 0;
    });
  }
  async findAll() {
    const teams = await this.teamRepo.find({ order: { name: 'ASC' } });

    return this.alphabeticalOrder(teams);
  }

  async assignedPaquete(_id: number) {
    const team = await this.teamRepo.findOne({
      where: { _id },
      relations: {
        tasks: {
          items: true,
          member: { paquete: true },
        },
      },
      order: {
        tasks: { priority: 'ASC', member: { paquete: { name: 'ASC' } } },
      },
    });

    if (!team) {
      throw new NotFoundException();
    }

    const paquetes = {};
    team.tasks.forEach((task) => {
      task.items.forEach((it) => {
        if (it.assigned > it.cutted) {
          paquetes[task.member.paquete._id] = task.member.paquete.name;
        }
      });
    });

    return paquetes;
  }

  async findOne(_id: number, paquete_id: number) {
    const team = await this.teamRepo.findOne({
      where: { _id, tasks: { member: { paquete: { _id: paquete_id } } } },
      relations: {
        tasks: {
          member: { paquete: true },
          items: { machine: true, material: true },
        },
      },
      order: { tasks: { priority: 'ASC' } },
    });

    if (!team) {
      throw new NotFoundException();
    }

    return {
      name: team.name,
      tasks: team.tasks.map((task) => {
        return {
          quanttity: task.quantity,
          priority: task.priority,
          piecemark: task.member.piecemark,
          desc: `${task.member.mem_desc} ${task.member.main_material}`,
          ready: Math.round(
            (task.items.reduce((acc, item) => (acc += item.cutted), 0) /
              task.items.reduce((acc, item) => (acc += item.assigned), 0)) *
              100,
          ),
          items: task.items.map((itm) => {
            return {
              assigned: itm.assigned,
              cuted: itm.cutted,
              mark: itm.material.mark,
              section: itm.material.section,
              machine: itm.machine.name,
            };
          }),
        };
      }),
    };
  }

  update(_id: number, updateTeamDto: UpdateTeamDto) {
    return this.teamRepo.update({ _id }, { ...updateTeamDto });
  }

  remove(id: number) {
    return this.teamRepo.softDelete(id);
  }
}
