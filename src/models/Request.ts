import { IRequestHandler } from '../handlers/IRequestHandler';

export class Request {
  constructor(private handler: IRequestHandler) {}

  async process() {
    this.handler.handleRequest();
  }
}
