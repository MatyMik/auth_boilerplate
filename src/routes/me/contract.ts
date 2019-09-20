import { Router, Response } from 'express';
import Joi from 'joi';
import { param } from '../../middlewares/validate';
import { pickBaseContractProperties } from '../../utils/pick';
import { ContextualRequest, Contract  } from '../../types';

const router = Router();

router.get('/', async (req: ContextualRequest, res: Response) => {
  const results = await req.context.models.contract.find();
  const json = results && results.map(pickBaseContractProperties);
  res.json(json || []);
});

router.get('/:hash', 
  param('hash', Joi.string()),
  async (req: ContextualRequest, res: Response) => {
    const hash = req.params.hash;
    const result = await req.context.models.contract.findByUserAndHash(req.context.user._id, hash);
    res.json(result);
});

router.put('/:hash', 
  param('hash', Joi.string()),
  async (req: ContextualRequest, res: Response) => {
    const hash = req.params.hash;
    const body = req.body;
    const result = await req.context.models.contract.update(req.context.user._id, hash, body);
    res.json(result);
});

export default router;
