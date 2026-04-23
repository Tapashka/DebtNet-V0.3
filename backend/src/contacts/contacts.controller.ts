import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { ContactsService } from './contacts.service';

@Controller('contacts')
@UseGuards(JwtAuthGuard)
export class ContactsController {
  constructor(private contacts: ContactsService) {}

  @Get()
  list(@CurrentUser() user: any) {
    return this.contacts.list(user.id);
  }

  @Post('invites')
  createInvite(@CurrentUser() user: any) {
    return this.contacts.createInvite(user.id);
  }

  @Post('invites/:token/accept')
  acceptInvite(@CurrentUser() user: any, @Param('token') token: string) {
    return this.contacts.acceptInvite(token, user.id);
  }

  @Delete(':contactUserId')
  remove(@CurrentUser() user: any, @Param('contactUserId') cid: string) {
    return this.contacts.remove(user.id, cid);
  }
}
