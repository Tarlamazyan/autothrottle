import { IncomingMessage } from 'http';
import { RateLimiter } from './RateLimiter';
import { IRequestHandler } from '../handlers/IRequestHandler';

class TestRequestHandler implements IRequestHandler {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleRequest() { }
  handleGetLimits(): Promise<void> {
    return Promise.resolve();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handlePutLimits(req: IncomingMessage): Promise<void> {
    return Promise.resolve();
  }
}

describe('RateLimiter', () => {
  it('should process requests within limits', async () => {
    const rateLimiter = new RateLimiter(5, 1000);
    const requestHandler = new TestRequestHandler();

    for (let i = 0; i < 5; i++) {
      const isQueued = await rateLimiter.processRequest('test-user', requestHandler);
      expect(isQueued).toBe(false);
    }
  });

  it('should queue requests exceeding limits', async () => {
    const rateLimiter = new RateLimiter(2, 100);
    const requestHandler = new TestRequestHandler();

    for (let i = 0; i < 2; i++) {
      const isQueued = await rateLimiter.processRequest('test-user', requestHandler);
      expect(isQueued).toBe(false);
    }

    const isQueued = await rateLimiter.processRequest('test-user', requestHandler);
    expect(isQueued).toBe(true);
  });

  it('should process queued requests after interval', (done) => {
    jest.useRealTimers();

    const rateLimiter = new RateLimiter(1, 1);
    const mockHandler1 = jest.fn();
    const mockHandler2 = jest.fn();

    const requestHandler1 = new TestRequestHandler();
    requestHandler1.handleRequest = mockHandler1;

    const requestHandler2 = new TestRequestHandler();
    requestHandler2.handleRequest = mockHandler2;

    rateLimiter.processRequest('user1', requestHandler1);

    setTimeout(() => {
      rateLimiter.processRequest('user1', requestHandler2);
    }, 500);

    expect(mockHandler1).toHaveBeenCalledTimes(1);
    expect(mockHandler2).toHaveBeenCalledTimes(0);

    rateLimiter.on('requestProcessed', () => {
      if (mockHandler2.mock.calls.length === 1) {
        expect(mockHandler1).toHaveBeenCalledTimes(1);
        expect(mockHandler2).toHaveBeenCalledTimes(1);
        done();
      }
    });
  });

  it('should update limits', () => {
    const rateLimiter = new RateLimiter(2, 10);

    rateLimiter.setMaxRequests(5);
    rateLimiter.setInterval(20);

    const limits = rateLimiter.getLimits();
    expect(limits.maxRequests).toBe(5);
    expect(limits.interval).toBe(20);
  });

  it('should reset limits to default', () => {
    const rateLimiter = new RateLimiter(5, 20);

    rateLimiter.resetLimits();

    const limits = rateLimiter.getLimits();
    expect(limits.maxRequests).toBe(2);
    expect(limits.interval).toBe(10);
  });
});
