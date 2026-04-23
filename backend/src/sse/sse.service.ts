import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

interface SseEvent {
  userId: string;
  type: string;
  data: any;
}

@Injectable()
export class SseService {
  private bus = new Subject<SseEvent>();

  emit(userId: string, type: string, data: any) {
    this.bus.next({ userId, type, data });
  }

  stream(userId: string) {
    return this.bus.asObservable().pipe(
      filter(e => e.userId === userId),
      map(e => ({ type: e.type, data: JSON.stringify(e.data) })),
    );
  }
}
