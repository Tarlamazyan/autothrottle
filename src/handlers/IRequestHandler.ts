import { IncomingMessage } from 'http';

export interface IRequestHandler {
  handleRequest(): void;
  handleGetLimits(): Promise<void>;
  handlePutLimits(req: IncomingMessage): Promise<void>;
}
