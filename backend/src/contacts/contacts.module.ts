import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './contact.entity';
import { InviteToken } from './invite-token.entity';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { UsersModule } from '../users/users.module';
import { SseModule } from '../sse/sse.module';

@Module({
  imports: [TypeOrmModule.forFeature([Contact, InviteToken]), UsersModule, SseModule],
  providers: [ContactsService],
  controllers: [ContactsController],
})
export class ContactsModule {}
