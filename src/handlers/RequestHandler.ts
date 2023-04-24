import { IncomingMessage, ServerResponse } from 'http';
import { IRequestHandler } from './IRequestHandler';
import { RateLimiter } from '../models/RateLimiter';
import { INTERNAL_SERVER_ERROR, INVALID_JSON, LIMITS_UPDATED, REQUEST_PROCESSED } from '../constants';

export class RequestHandler implements IRequestHandler {
  constructor(private res: ServerResponse, private next: () => void, private rateLimiter: RateLimiter) {}

  public handleRequest() {
    this.res.writeHead(200, { 'Content-Type': 'text/plain' });
    this.res.end(`${REQUEST_PROCESSED}\n`);
    console.log(REQUEST_PROCESSED);
  }

  public async handleGetLimits(): Promise<void> {
    const limits = this.rateLimiter.getLimits();
    this.res.writeHead(200, { 'Content-Type': 'application/json' });
    this.res.end(JSON.stringify(limits));
  }

  public async handlePutLimits(req: IncomingMessage): Promise<void> {
    const body = await new Promise<string>((resolve, reject) => {
      let data = '';

      req.on('data', (chunk) => {
        data += chunk;
      });

      req.on('end', () => {
        resolve(data);
      });

      req.on('error', (err) => {
        reject(err);
      });
    });

    try {
      const { maxRequests, interval } = JSON.parse(body);
      this.rateLimiter.setMaxRequests(maxRequests);
      this.rateLimiter.setInterval(interval);
      this.sendSuccess(200, { message: LIMITS_UPDATED });
    } catch (error) {
      if (error instanceof SyntaxError) {
        this.sendError(400, INVALID_JSON);
      } else {
        this.sendError(500, INTERNAL_SERVER_ERROR);
      }
    }
  }

  public sendError(statusCode: number, message: string) {
    this.res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    this.res.end(JSON.stringify({ message }));
  }

  private sendSuccess<T>(statusCode: number, data: T) {
    this.res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    this.res.end(JSON.stringify(data));
  }
}
