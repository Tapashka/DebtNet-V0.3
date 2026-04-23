import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RefreshToken } from './refresh-token.entity';
import { RegisterDto, LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
    @InjectRepository(RefreshToken) private rtRepo: Repository<RefreshToken>,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.users.findByEmail(dto.email);
    if (exists) throw new ConflictException('Email already in use');
    const usernameExists = await this.users.findByUsername(dto.username);
    if (usernameExists) throw new ConflictException('Username already taken');
    const password_hash = await bcrypt.hash(dto.password, 10);
    const user = await this.users.create({ ...dto, password_hash });
    return this.issueTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(dto.password, user.password_hash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return this.issueTokens(user);
  }

  async refresh(token: string) {
    const hash = await bcrypt.hash(token, 1);
    const stored = await this.rtRepo.findOne({ where: { token_hash: hash } });
    if (!stored || stored.expires_at < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.users.findById(stored.user_id);
    await this.rtRepo.delete(stored.id);
    return this.issueTokens(user);
  }

  private async issueTokens(user: any) {
    const payload = { sub: user.id, email: user.email, username: user.username };
    const access_token = this.jwt.sign(payload, { expiresIn: '15m' });
    const refresh_token = require('uuid').v4();
    const hash = await bcrypt.hash(refresh_token, 1);
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await this.rtRepo.save(this.rtRepo.create({ user_id: user.id, token_hash: hash, expires_at: expires }));
    return { access_token, refresh_token, user: { id: user.id, username: user.username, email: user.email } };
  }
}
