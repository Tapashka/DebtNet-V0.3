import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SseService } from './sse.service';
import { SseController } from './sse.controller';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET || 'secret' })],
  providers: [SseService],
  controllers: [SseController],
  exports: [SseService],
})
export class SseModule {}
