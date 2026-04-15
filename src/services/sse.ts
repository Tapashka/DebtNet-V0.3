import { API_URL } from './api';
import { getTokens } from './api';

export type SseEventType =
  | 'loan.transaction.created'
  | 'bill.status_changed'
  | 'bill.participant_responded'
  | 'contact.added'
  | 'contact.removed'
  | 'ping';

export interface SseEnvelope {
  event_id:  string;
  timestamp: number;
  data:      Record<string, unknown>;
}

type SseHandler = (envelope: SseEnvelope) => void;

class SseClient {
  private es: EventSource | null = null;
  private startTime = 0;
  private handlers: Map<SseEventType, SseHandler[]> = new Map();
  private onReconnect?: () => void;

  on(event: SseEventType, handler: SseHandler) {
    const list = this.handlers.get(event) ?? [];
    list.push(handler);
    this.handlers.set(event, list);
  }

  off(event: SseEventType, handler: SseHandler) {
    const list = (this.handlers.get(event) ?? []).filter(h => h !== handler);
    this.handlers.set(event, list);
  }

  setReconnectHandler(fn: () => void) {
    this.onReconnect = fn;
  }

  async connect() {
    if (this.es) this.es.close();
    const t = await getTokens();
    if (!t?.access_token) return;

    this.startTime = Date.now();
    const url = `${API_URL}/events?token=${encodeURIComponent(t.access_token)}`;

    try {
      this.es = new EventSource(url);
    } catch {
      // EventSource not available (RN without polyfill)
      return;
    }

    // Register all event types
    const types: SseEventType[] = [
      'loan.transaction.created',
      'bill.status_changed',
      'bill.participant_responded',
      'contact.added',
      'contact.removed',
      'ping',
    ];

    types.forEach(type => {
      this.es!.addEventListener(type, (e: MessageEvent) => {
        if (type === 'ping') return;
        try {
          const env: SseEnvelope = JSON.parse(e.data || '{}');
          // Discard stale events (before snapshot was loaded)
          if ((env.timestamp ?? 0) < this.startTime / 1000) return;
          const handlers = this.handlers.get(type) ?? [];
          handlers.forEach(h => h(env));
        } catch {}
      });
    });

    this.es.onerror = () => {
      // On reconnect — reload snapshots
      this.startTime = Date.now();
      this.onReconnect?.();
    };
  }

  disconnect() {
    this.es?.close();
    this.es = null;
  }
}

export const sseClient = new SseClient();
