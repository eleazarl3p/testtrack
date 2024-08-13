import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  Post,
  Body,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberToAreaDto } from './dto/member-to-area.dto';
import { ValidateMemberAreaPipe } from './dto/validatea-ma-pipe';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get('job/:jobid/')
  findAll(
    @Param('jobid', ParseIntPipe) jobid: number,
    @Query('paqueteid') paqueteid: number,
  ) {
    return this.memberService.findAll(jobid, paqueteid);
  }

  @Get('not-yet-assigned-to-team/:pqtid')
  memberNotYetAssigned(@Param('pqtid', ParseIntPipe) pqtid: number) {
    return this.memberService.memberNotYetAssignedToTeam(pqtid);
  }

  @Get('/one/:jobid/:id')
  findOne(
    @Param('jobid', ParseIntPipe) jobid: number,
    @Param('id', ParseIntPipe) _id: number,
  ) {
    return this.memberService.findOne(jobid, _id);
  }

  @Post('/area/:areaId')
  async moveToArea(
    @Param('areaId', ParseIntPipe) areaId: number,
    @Body(new ValidateMemberAreaPipe()) membertoAreaDto: MemberToAreaDto[],
  ) {
    await this.memberService.moveToArea(areaId, membertoAreaDto);
  }

  @Get('available/area/:jobId/:areaId')
  async availableMembers(
    @Param('jobId', ParseIntPipe) jobId: number,
    @Param('areaId', ParseIntPipe) areaId: number,
  ) {
    const members = await this.memberService.availableMembers(jobId, areaId);
    return members;
  }
}
