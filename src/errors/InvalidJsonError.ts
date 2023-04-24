import { ApiError } from './ApiError';
import { INVALID_JSON } from '../constants';

export class InvalidJsonError extends ApiError {
  constructor() {
    super(400, INVALID_JSON);
  }
}
