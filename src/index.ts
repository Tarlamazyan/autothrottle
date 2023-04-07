import config from './config.json';
import RateLimiterServer from './server';

const { PORT, DEFAULT_MAX_REQUESTS, DEFAULT_INTERVAL } = config;

const rateLimiterServer = new RateLimiterServer(PORT, DEFAULT_MAX_REQUESTS, DEFAULT_INTERVAL);
rateLimiterServer.listen();
