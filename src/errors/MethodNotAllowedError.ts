import { ApiError } from './ApiError';
import { METHOD_NOT_ALLOWED } from '../constatns';

export class MethodNotAllowedError extends ApiError {
  constructor() {
    super(405, METHOD_NOT_ALLOWED);
  }
}
