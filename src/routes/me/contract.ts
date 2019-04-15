import { Router, Response } from 'express';
import Joi from 'joi';
import { param, body } from '../../middlewares/validate';
import { ContractSchema } from '../../utils/schemas';
import { ContextualRequest } from '../../types';

const router = Router();

router.post('/', body(ContractSchema), async (req: ContextualRequest, res: Response) => {
  const contract = { ...req.body, created_by: req.context.user._id };
  const result = await req.context.models.contract.create(contract)
  res.json(result);
});

router.get('/', async (req: ContextualRequest, res: Response) => {
  const result = await req.context.models.contract.findByUser(req.context.user._id);
  res.json(result);
});


export default router;
