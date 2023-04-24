import { ApiError } from './ApiError';
import { TOO_MANY_REQUESTS } from '../constants';

export class TooManyRequestsError extends ApiError {
  constructor() {
    super(429, TOO_MANY_REQUESTS);
  }
}
