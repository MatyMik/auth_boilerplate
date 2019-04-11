import { Response, NextFunction } from 'express';
import { ContextualRequest } from '../types';
import { ApiError } from '../utils/errors';
const { MulterError } = require('multer');

export default (error: Error, req: ContextualRequest, res: Response, next: NextFunction) => {
  const errorDetails = `\nRejected API call: ${req.method.toUpperCase()} ${req.path}\nHeaders: ${JSON.stringify(
    req.headers,
    null,
    2
  )}\nQuery: ${JSON.stringify(req.query, null, 2)}\nBody: ${JSON.stringify(req.body, null, 2)}`;
  if (error instanceof MulterError) {
    req.context.logger.error(error.message, errorDetails);
    const status = 422;
    res.status(status).json({ message: error.message, status, code: 'VALIDATION_ERROR' });
  } else {
    req.context.logger.error(error instanceof Error ? error.message : error, errorDetails);
    const [message, status = 500, code = 'INTERNAL_ERROR'] = error.message.split('|');
    res.status(Number(status)).json({ message, status: Number(status), code, payload: (error as ApiError).payload });
  }
};
