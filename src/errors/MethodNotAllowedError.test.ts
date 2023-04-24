import { MethodNotAllowedError } from './MethodNotAllowedError';
import { METHOD_NOT_ALLOWED } from '../constants';

describe('MethodNotAllowedError', () => {
  it('should create a MethodNotAllowedError with the correct statusCode and message', () => {
    const error = new MethodNotAllowedError();

    expect(error.statusCode).toBe(405);
    expect(error.message).toBe(METHOD_NOT_ALLOWED);
    expect(error.name).toBe('MethodNotAllowedError');
  });
});
