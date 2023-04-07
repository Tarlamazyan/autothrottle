import { ApiError } from './ApiError';

describe('ApiError', () => {
  it('should create an ApiError with the correct statusCode and message', () => {
    const error = new ApiError(400, 'Test error message');

    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Test error message');
    expect(error.name).toBe('ApiError');
  });
});
