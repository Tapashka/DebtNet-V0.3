import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Contact } from './contact.entity';
import { InviteToken } from './invite-token.entity';
import { UsersService } from '../users/users.service';
import { SseService } from '../sse/sse.service';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact) private contacts: Repository<Contact>,
    @InjectRepository(InviteToken) private invites: Repository<InviteToken>,
    private users: UsersService,
    private sse: SseService,
  ) {}

  async list(ownerId: string) {
    const contacts = await this.contacts.find({ where: { owner_id: ownerId } });
    const result = await Promise.all(
      contacts.map(async c => {
        const user = await this.users.findById(c.contact_user_id);
        return { id: c.contact_user_id, username: user?.username || 'Unknown', source: c.source };
      }),
    );
    return { contacts: result };
  }

  async createInvite(ownerId: string) {
    const token = uuidv4();
    const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.invites.save(this.invites.create({ owner_id: ownerId, token, expires_at }));
    return { token, tg_invite_url: `https://t.me/debtnet_bot?start=${token}` };
  }

  async acceptInvite(token: string, acceptorId: string) {
    const invite = await this.invites.findOne({ where: { token, used: false } });
    if (!invite || invite.expires_at < new Date()) throw new NotFoundException('Invalid or expired invite');
    if (invite.owner_id === acceptorId) throw new BadRequestException('Cannot add yourself');

    await this.contacts.save(this.contacts.create({ owner_id: invite.owner_id, contact_user_id: acceptorId, source: 'explicit' }));
    await this.contacts.save(this.contacts.create({ owner_id: acceptorId, contact_user_id: invite.owner_id, source: 'explicit' }));
    await this.invites.update(invite.id, { used: true });

    const user = await this.users.findById(acceptorId);
    this.sse.emit(invite.owner_id, 'contact.added', { contact_user_id: acceptorId, timestamp: Date.now() / 1000 });

    return { accepted: true, contact: { id: acceptorId, username: user?.username } };
  }

  async remove(ownerId: string, contactUserId: string) {
    await this.contacts.delete({ owner_id: ownerId, contact_user_id: contactUserId });
    this.sse.emit(ownerId, 'contact.removed', { contact_user_id: contactUserId, timestamp: Date.now() / 1000 });
    return { removed: true };
  }
}
