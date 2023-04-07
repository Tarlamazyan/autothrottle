import { Request } from './Request';
import { IRequestHandler } from '../handlers/IRequestHandler';

class MockRequestHandler implements IRequestHandler {
  handleRequest = jest.fn().mockResolvedValue(undefined);
}

describe('Request', () => {
  it('should call the handleRequest method on the handler', async () => {
    const mockRequestHandler = new MockRequestHandler();
    const request = new Request(mockRequestHandler);

    await request.process();

    expect(mockRequestHandler.handleRequest).toHaveBeenCalledTimes(1);
  });
});
