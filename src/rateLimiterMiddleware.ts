import { IncomingMessage, ServerResponse } from 'http';
import { RateLimiter } from './models/RateLimiter';
import { UserId } from './types';
import { LIMITS_ENDPOINT } from './constants';
import { functionalSwitch } from './utils';
import { RequestHandler } from './handlers/RequestHandler';

export function createRateLimiterMiddleware(
  maxRequests: number,
  interval: number
): (req: IncomingMessage, res: ServerResponse, next: () => void) => Promise<void> {
  const rateLimiter = new RateLimiter(maxRequests, interval);

  return async function rateLimiterMiddleware(
    req: IncomingMessage,
    res: ServerResponse,
    next: () => void
  ): Promise<void> {
    const { socket: { remoteAddress }, method, url } = req;

    if (url === LIMITS_ENDPOINT) {
      const requestHandler = new RequestHandler(res, next, rateLimiter);
      const actions = {
        GET: async () => requestHandler.handleGetLimits(),
        PUT: async () => requestHandler.handlePutLimits(req)
      };

      try {
        await functionalSwitch<void>(method, actions, () => {
          throw new Error('Method Not Allowed');
        });
      } catch (error) {
        requestHandler.sendError(405, error.message);

      }
    } else {
      const userId: UserId = remoteAddress || 'unknown';
      const requestHandler = new RequestHandler(res, next, rateLimiter);

      try {
        const isQueued = await rateLimiter.processRequest(userId, requestHandler);

        if (!isQueued) {
          next();
        }
      } catch (error) {
        requestHandler.sendError(500, 'Internal Server Error');
      }
    }
  };
}
