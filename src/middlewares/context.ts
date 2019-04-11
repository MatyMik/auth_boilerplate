import { Response, NextFunction } from 'express';
import { ContextualRequest, Context } from '../types';

export default (context: Context) => (req: ContextualRequest, res: Response, next: NextFunction) => {
  req.context = context;
  next();
};
