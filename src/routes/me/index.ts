import { Router, Response } from 'express';
import { ContextualRequest } from '../../types';
import contract from './contract';

const router = Router();

router.get('/', (req: ContextualRequest, res: Response) => {
  res.json(req.context.user);
});

router.use('/contract', contract);

export default router;
