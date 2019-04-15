import { Response, NextFunction } from 'express';
import { ContextualRequest } from '../types';
import { ApiError } from '../utils/errors';
const { MulterError } = require('multer');

export default (error: Error, req: ContextualRequest, res: Response, next: NextFunction) => {
  if (error instanceof MulterError) {
    const status = 422;
    res.status(status).json({ message: error.message, status, code: 'VALIDATION_ERROR' });
  } else {
    const [message, status = 500, code = 'INTERNAL_ERROR'] = error.message.split('|');
    res.status(Number(status)).json({ message, status: Number(status), code, payload: (error as ApiError).payload });
  }
};
