import { Controller, Get, Query, Sse, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SseService } from './sse.service';

@Controller('events')
export class SseController {
  constructor(private sse: SseService, private jwt: JwtService) {}

  @Sse()
  stream(@Query('token') token: string) {
    try {
      const payload = this.jwt.verify(token, { secret: process.env.JWT_SECRET || 'secret' });
      return this.sse.stream(payload.sub);
    } catch {
      throw new UnauthorizedException();
    }
  }
}
