import request from 'supertest';
import config from '../src/config.json';
import RateLimiterServer from './server';

const { DEFAULT_MAX_REQUESTS, DEFAULT_INTERVAL } = config;
const TEST_PORT = 3002;

describe('RateLimiterServer', () => {
  let server: ReturnType<typeof RateLimiterServer.prototype.listen>;
  let rateLimiterServer: RateLimiterServer;

  beforeEach(() => {
    rateLimiterServer = new RateLimiterServer(TEST_PORT, DEFAULT_MAX_REQUESTS, DEFAULT_INTERVAL);
    server = rateLimiterServer.listen();
  });

  afterEach(async () => {
    await new Promise<void>((resolve) => rateLimiterServer.close(() => resolve()));
  });

  describe('GET /limits', () => {
    it('should return the current rate limits', async () => {
      const res = await request(server).get('/limits');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ maxRequests: DEFAULT_MAX_REQUESTS, interval: DEFAULT_INTERVAL });
    });
  });

  describe('PUT /limits', () => {
    it('should update the rate limits and return a success message', async () => {
      const newMaxRequests = 10;
      const newInterval = 60000;

      const res = await request(server)
        .put('/limits')
        .send({ maxRequests: newMaxRequests, interval: newInterval });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Limits updated' });
    });

    it('should return an error when the request body is invalid JSON', async () => {
      const res = await request(server)
        .put('/limits')
        .send('invalid JSON');

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Invalid JSON' });
    });
  });

  // Add more tests for other endpoints and scenarios.
});
