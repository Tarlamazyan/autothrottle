import { ApiError } from './ApiError';
import { METHOD_NOT_ALLOWED } from '../constants';

export class MethodNotAllowedError extends ApiError {
  constructor() {
    super(405, METHOD_NOT_ALLOWED);
  }
}
