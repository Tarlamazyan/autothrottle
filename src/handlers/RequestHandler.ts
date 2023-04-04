import { IRequestHandler } from './IRequestHandler';
import { ServerResponse } from 'http';

export class RequestHandler implements IRequestHandler {
  constructor(private res: ServerResponse) {}

  handleRequest() {
    this.res.writeHead(200, { 'Content-Type': 'text/plain' });
    this.res.end('Request processed\n');
    console.log('Request processed');
  }
}
