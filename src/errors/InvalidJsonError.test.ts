import { InvalidJsonError } from './InvalidJsonError';
import { INVALID_JSON } from '../constatns';

describe('InvalidJsonError', () => {
  it('should create an InvalidJsonError with the correct statusCode and message', () => {
    const error = new InvalidJsonError();

    expect(error.statusCode).toBe(400);
    expect(error.message).toBe(INVALID_JSON);
    expect(error.name).toBe('InvalidJsonError');
  });
});
