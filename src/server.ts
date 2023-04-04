import * as http from 'http';
import config from './config.json';
import { RateLimiter } from './models/RateLimiter';
import { UserId } from './types';
import { IRequestHandler } from './handlers/IRequestHandler';
import { functionalSwitch } from './utils';
import { ApiError, InvalidJsonError, MethodNotAllowedError } from './errors';
import {
  INTERNAL_SERVER_ERROR, LIMITS_ENDPOINT, LIMITS_UPDATED, SERVER_LISTENING_ON_PORT, REQUEST_PROCESSED, REQUEST_QUEUED
} from './constatns';

const { PORT, DEFAULT_INTERVAL, DEFAULT_MAX_REQUESTS } = config;

class RequestHandler implements IRequestHandler {
  constructor(private res: http.ServerResponse) {}

  handleRequest() {
    this.res.writeHead(200, { 'Content-Type': 'text/plain' });
    this.res.end(`${REQUEST_PROCESSED}\n`);
    console.log(`${REQUEST_PROCESSED}`);
  }
}

class RateLimiterServer {
  private rateLimiter: RateLimiter;
  private server: http.Server;

  constructor(private port: number, maxRequests: number, interval: number) {
    this.rateLimiter = new RateLimiter(maxRequests, interval);
    this.server = http.createServer(this.handleRequest.bind(this));
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log(`${SERVER_LISTENING_ON_PORT} ${this.port}`);
    });
  }

  private async handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const { socket: { remoteAddress }, method, url } = req;

    if (url === LIMITS_ENDPOINT) {
      const actions = {
        GET: async () => this.handleGetLimits(res),
        PUT: async () => this.handlePutLimits(req, res)
      };

      try {
        await functionalSwitch<void>(method, actions, () => {
          throw new MethodNotAllowedError();
        });
      } catch (error) {
        if (error instanceof ApiError) {
          this.sendError(res, error.statusCode, error.message);
        } else {
          this.sendError(res, 500, INTERNAL_SERVER_ERROR);
        }
        return;
      }
    }

    const userId: UserId = remoteAddress || 'unknown';
    const requestHandler = new RequestHandler(res);
    const isQueued = await this.rateLimiter.processRequest(userId, requestHandler);

    if (isQueued) {
      console.log(`${REQUEST_QUEUED} ${userId}`);
    }
  }

  private handleGetLimits(res: http.ServerResponse) {
    const limits = this.rateLimiter.getLimits();
    this.sendSuccess(res, 200, limits);
  }

  private async handlePutLimits(req: http.IncomingMessage, res: http.ServerResponse) {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const { maxRequests, interval } = JSON.parse(body);
        this.rateLimiter.setMaxRequests(maxRequests);
        this.rateLimiter.setInterval(interval);
        this.sendSuccess(res, 200, { message: LIMITS_UPDATED });
      } catch (error) {
        throw new InvalidJsonError();
      }
    });
  }

  private sendError(res: http.ServerResponse, statusCode: number, message: string) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message }));
  }

  private sendSuccess<T>(res: http.ServerResponse, statusCode: number, data: T) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  }
}

const rateLimiterServer = new RateLimiterServer(PORT, DEFAULT_MAX_REQUESTS, DEFAULT_INTERVAL);
rateLimiterServer.listen();

