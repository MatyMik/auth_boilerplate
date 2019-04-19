import { Router, Response } from 'express';
import uniqid from 'uniqid';
import Joi from 'joi';
import { param, body } from '../../middlewares/validate';
import { ContractSchema } from '../../utils/schemas';
import { ContextualRequest, ContractInput } from '../../types';

const router = Router();

router.post('/', body(ContractSchema), async (req: ContextualRequest, res: Response) => {
  const { region, type, name, email } = req.body;

  const username = uniqid(`${name.replace(/[^A-Z0-9]+/ig, "_")}-`);
  const user = await req.context.models.user.create({ name, username, email, disabled: true, suspended: true });
 
  const contract = {
    region,
    type,
    created_by: req.context.user._id, 
    assigned: [
      { 
        _id: req.context.user._id.toString(),
        name: req.context.user.name,
        username: req.context.user.username,
        role: 'MANAGER'
      },
      { 
        _id: user._id.toString(),
        name: user.name,
        username: user.username,
        role: 'ENTITY'
      }
    ], 
    history: [
      { 
        _id: req.context.user._id.toString(),
        name: req.context.user.name,
        username: req.context.user.username,
        action: 'CREATE',
        at: Date.now() 
      }
    ]
  } as ContractInput 


  const result = await req.context.models.contract.create(contract);
  const emailMessage = `
    Dear ${user.name},
    
    New contract created with ${result._id} id
    Username: ${user.username}
  `;

  await req.context.email.sendNewContractCreated(req.context, user.email, emailMessage);
  res.json(result);
});

router.get('/', async (req: ContextualRequest, res: Response) => {
  const result = await req.context.models.contract.findByUser(req.context.user._id);
  res.json(result);
});

export default router;
