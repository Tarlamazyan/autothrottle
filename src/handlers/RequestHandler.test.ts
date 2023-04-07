import { RequestHandler } from './RequestHandler';
import { ServerResponse } from 'http';

describe('RequestHandler', () => {
  let res: ServerResponse;
  let writeHeadMock: jest.SpyInstance;
  let endMock: jest.SpyInstance;
  let logMock: jest.SpyInstance;

  beforeEach(() => {
    writeHeadMock = jest.fn();
    endMock = jest.fn();
    logMock = jest.spyOn(console, 'log').mockImplementation();

    res = {
      writeHead: writeHeadMock,
      end: endMock,
    } as unknown as ServerResponse;
  });

  afterEach(() => {
    logMock.mockRestore();
  });

  it('should call writeHead, end, and console.log with correct arguments', () => {
    const requestHandler = new RequestHandler(res);

    requestHandler.handleRequest();

    expect(writeHeadMock).toHaveBeenCalledWith(200, { 'Content-Type': 'text/plain' });
    expect(endMock).toHaveBeenCalledWith('Request processed\n');
    expect(logMock).toHaveBeenCalledWith('Request processed');
  });
});
