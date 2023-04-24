import { IncomingMessage, ServerResponse } from 'http';
import { IRequestHandler } from '../handlers/IRequestHandler';

class MockRequestHandler implements IRequestHandler {
  handleRequest = jest.fn().mockResolvedValue(undefined);

  handleGetLimits(): Promise<void> {
    return Promise.resolve();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handlePutLimits(req: IncomingMessage): Promise<void> {
    return Promise.resolve();
  }
}

describe('Request', () => {
  it('should call the handleRequest method on the handler', async () => {
    const mockRequestHandler = new MockRequestHandler();
    const mockReq = {} as IncomingMessage;
    const mockRes = {} as ServerResponse;
    await mockRequestHandler.handleRequest(mockReq, mockRes);

    expect(mockRequestHandler.handleRequest).toHaveBeenCalledTimes(1);
  });
});
