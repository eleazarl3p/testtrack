import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { MemberService } from './member.service';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get(':jobid/')
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

  @Get('available/area/:areaId/:jobId/:paqueteId')
  available(
    @Param('areaId', ParseIntPipe) areaId: number,
    @Param('jobId', ParseIntPipe) jobId: number,
    @Param('paqueteId', ParseIntPipe) paqueteId: number,
  ) {
    return this.memberService.availableForArea(areaId, jobId, paqueteId);
  }

  @Get('/test/:id')
  test() {
    return this.memberService.fullyCutMembers();
  }
}
