import { Router, Response } from 'express';
import Joi from 'joi';
import { param } from '../../middlewares/validate';
import { ContextualRequest  } from '../../types';

const router = Router();

router.get('/', async (req: ContextualRequest, res: Response) => {
  const result = await req.context.models.contract.find();
  res.json(result);
});

router.get('/:contractId', 
  param('contractId', Joi.string()),
  async (req: ContextualRequest, res: Response) => {
    const contractId = req.params.contractId;
    const result = await req.context.models.contract.findByUserAndId(req.context.user._id, contractId);
    res.json(result);
});

export default router;
