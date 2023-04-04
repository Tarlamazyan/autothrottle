import { ApiError } from './ApiError';
import { INVALID_JSON } from '../constatns';

export class InvalidJsonError extends ApiError {
  constructor() {
    super(400, INVALID_JSON);
  }
}
