import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  Post,
  Body,
  Req,
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
    @Req() req: any,
  ) {
    console.log(req.user);
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
    @Req() req: any,
  ) {
    await this.memberService.moveToArea(areaId, membertoAreaDto);
  }

  @Get('available/area/:jobId/:paqueteId/:areaId')
  async availableMembers(
    @Param('jobId', ParseIntPipe) jobId: number,
    @Param('paqueteId', ParseIntPipe) paqueteId: number,
    @Param('areaId', ParseIntPipe) areaId: number,
  ) {
    const members = await this.memberService.availableMembers(
      jobId,
      paqueteId,
      areaId,
    );
    return members;
  }
}
