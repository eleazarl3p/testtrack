import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { MemberService } from './member.service';

@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get(':jobid/')
  findAll(
    @Param('jobid', ParseIntPipe) jobid: number,
    @Query('paqueteid') paqueteid: string,
  ) {
    return this.memberService.findAll(jobid, paqueteid);
  }

  @Get('build-of-materials/:pqid/:piecemark')
  buildOfMaterials(
    @Param('pqid', ParseIntPipe) paqueteid: number,
    @Param('piecemark') piecemark: string,
  ) {
    return this.memberService.buildOfMaterials(paqueteid, piecemark);
  }
}
