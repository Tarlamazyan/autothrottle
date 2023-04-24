import { RequestHandler } from './RequestHandler';
import { ServerResponse } from 'http';
import { RateLimiter } from '../models/RateLimiter';
import { REQUEST_PROCESSED } from '../constants';

jest.mock('../models/RateLimiter');

describe('RequestHandler', () => {
  let res: ServerResponse;
  let writeHeadMock: jest.SpyInstance;
  let endMock: jest.SpyInstance;
  let logMock: jest.SpyInstance;
  let nextMock: jest.Mock;

  beforeEach(() => {
    writeHeadMock = jest.fn();
    endMock = jest.fn();
    logMock = jest.spyOn(console, 'log').mockImplementation();
    nextMock = jest.fn();

    res = {
      writeHead: writeHeadMock,
      end: endMock
    } as unknown as ServerResponse;
  });

  afterEach(() => {
    logMock.mockRestore();
  });

  it('should call writeHead, end, and console.log with correct arguments', () => {
    const rateLimiterMock = {
      getLimits: jest.fn(),
      setMaxRequests: jest.fn(),
      setInterval: jest.fn()
    } as unknown as RateLimiter;
    const requestHandler = new RequestHandler(res, nextMock, rateLimiterMock);

    requestHandler.handleRequest();

    expect(writeHeadMock).toHaveBeenCalledWith(200, { 'Content-Type': 'text/plain' });
    expect(endMock).toHaveBeenCalledWith(`${REQUEST_PROCESSED}\n`);
    expect(logMock).toHaveBeenCalledWith(REQUEST_PROCESSED);
  });
});
