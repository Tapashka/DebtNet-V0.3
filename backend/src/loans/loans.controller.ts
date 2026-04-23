import { Controller, Get, Post, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './loans.dto';

@Controller('loans')
@UseGuards(JwtAuthGuard)
export class LoansController {
  constructor(private loans: LoansService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateLoanDto) {
    return this.loans.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.loans.findAll(user.id);
  }

  @Get('summary')
  summary(@CurrentUser() user: any) {
    return this.loans.summary(user.id);
  }

  @Get('debtors')
  debtors(@CurrentUser() user: any) {
    return this.loans.debtors(user.id);
  }

  @Patch('settle/:counterpartyId')
  settle(@CurrentUser() user: any, @Param('counterpartyId') cid: string) {
    return this.loans.settle(user.id, cid);
  }
}
