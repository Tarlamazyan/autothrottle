import { EventEmitter } from 'events';
import { UserId } from '../types';
import { IRequestHandler } from '../handlers/IRequestHandler';
import { Request } from './Request';

const DEFAULT_MAX_REQUESTS = 2;
const DEFAULT_INTERVAL = 10;

export class RateLimiter extends EventEmitter {
  private requestQueue: Map<UserId, Request[]>;
  private timers: Map<UserId, NodeJS.Timeout>;
  private processingRequestsCount: Map<UserId, number>;

  constructor(private maxRequests: number, private interval: number) {
    super();

    this.requestQueue = new Map();
    this.timers = new Map();
    this.processingRequestsCount = new Map();
  }

  setMaxRequests(maxRequests: number): void {
    this.maxRequests = maxRequests;
  }

  setInterval(interval: number): void {
    this.interval = interval;
  }

  getLimits(): { maxRequests: number; interval: number } {
    return {
      maxRequests: this.maxRequests,
      interval: this.interval
    };
  }

  resetLimits(): void {
    this.maxRequests = DEFAULT_MAX_REQUESTS;
    this.interval = DEFAULT_INTERVAL;
  }

  async processRequest(userId: UserId, handler: IRequestHandler): Promise<boolean> {
    const request = new Request(handler);
    const processingRequests = this.processingRequestsCount.get(userId) || 0;

    if (processingRequests < this.maxRequests) {
      this.processingRequestsCount.set(userId, processingRequests + 1);

      await request.process();
      this.emit('requestProcessed', userId);

      if (!this.timers.has(userId)) {
        const timer = setTimeout(async () => {
          this.timers.delete(userId);
          this.processingRequestsCount.set(userId, 0);

          await this.processQueue(userId);
        }, this.interval * 1000);

        this.timers.set(userId, timer);
      }
      return false;
    } else {
      const queue = this.requestQueue.get(userId) || [];
      queue.push(request);
      this.requestQueue.set(userId, queue);
      return true;
    }
  }

  private async processQueue(userId: UserId) {
    const queue = this.requestQueue.get(userId) || [];

    while ((this.processingRequestsCount.get(userId) || 0) < this.maxRequests) {
      const request = queue.shift();

      if (request) {
        this.processingRequestsCount.set(userId, (this.processingRequestsCount.get(userId) || 0) + 1);
        await request.process();
        this.emit('requestProcessed', userId);
      } else {
        break;
      }
    }

    this.requestQueue.set(userId, queue);
  }
}

