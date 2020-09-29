export class ApiError extends Error {
  static message: string = "Something went wrong";
  static status: number;
  static code: string;
  payload?: any;

  static createMessage(message: string, code: string) {
    const parts = [message || this.message, this.status, code || this.code];
    return parts.join("|");
  }

  constructor(message?: string, code?: string, payload?: any) {
    super();
    this.message = (this.constructor as typeof ApiError).createMessage(message, code);
    if (payload) this.payload = payload;
  }
}

export class RequestError extends ApiError {
  static message = "REQUEST_ERROR";
  static status = 400;
  static code = "INVALID_REQUEST";
}

export class AuthorizationError extends ApiError {
  static message = "UNAUTHORIZED";
  static status = 401;
  static code = "UNAUTHORIZED";
}

export class PermissionError extends ApiError {
  static message = "PERMISSION_ERROR";
  static status = 403;
  static code = "PERMISSION_ERROR";
}

export class NotFoundError extends ApiError {
  static message = "RESOURCE_NOT_FOUND";
  static status = 404;
  static code = "NOT_FOUND";
}

export class UserNotFoundError extends ApiError {
  static message = "User Not Found";
  static status = 404;
  static code = "NOT_FOUND";
}

export class ValidationError extends ApiError {
  static message = "VALIDATION_ERROR";
  static status = 422;
  static code = "VALIDATION_ERROR";
}

export class UserAlreadyExists extends ApiError {
  static message = "User Already Exists";
  static status = 422;
  static code = "VALIDATION_ERROR";
}
