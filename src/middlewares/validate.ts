import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from '../utils/errors';

const errorHandler = (error: Joi.ValidationError, next: NextFunction) => {
  const message = error.details
    ? error.details
        .map(({ message }) => message)
        .filter(_ => _)
        .join('\n')
    : 'unknown';
  next(new ValidationError(message));
};

export const body = (schema: Joi.Schema) => (req: Request, res: Response, next: NextFunction) => {
  const result = Joi.validate(req.body, schema);
  if (result.error) errorHandler(result.error, next);
  else next();
};

export const param = (field: string, schema: Joi.Schema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    req.params[field] = Joi.attempt(req.params[field], schema.label(field));
    next();
  } catch (error) {
    errorHandler(error, next);
  }
};

export const query = (field: string, schema: Joi.Schema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    req.query[field] = Joi.attempt(req.query[field], schema.label(field));
    next();
  } catch (error) {
    errorHandler(error, next);
  }
};

export const header = (field: string, schema: Joi.Schema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    req.headers[field] = Joi.attempt(req.headers[field], schema.label(field));
    next();
  } catch (error) {
    errorHandler(error, next);
  }
};
