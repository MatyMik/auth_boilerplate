import config from 'config';
import crypto from 'crypto';
import { Router, Response } from 'express';
import { body } from '../middlewares/validate';
import { ContextualRequest, ContractType  } from '../types';
import { ContractSchema } from '../utils/schemas';
import mailTemplate from '../utils/emailTemplates/new-contract-customer';
import { defaultCompanyContract, defaultPrivatePersonContract } from '../utils/contract';

const router = Router();
router.post('/', body(ContractSchema), async (req: ContextualRequest, res: Response) => {
  const { type, requester_name, contact_name, contact_email } = req.body;
  const contract = type === ContractType.COMPANY ? 
    defaultCompanyContract() : 
    defaultPrivatePersonContract();

  const key = crypto.randomBytes(64).toString('hex');
  const nextContract = {
    ...contract,
    ...req.body,
    key,
    history: [
      { 
        name: requester_name,
        action: 'CREATE',
        at: Date.now() 
      }
    ],
    assigned: [
      { 
        name: contact_name,
        email: contact_email,
        role: 'ENTITY'
      }
    ], 
  }

  const result = await req.context.models.contract.create(nextContract);
  const message = mailTemplate(`${config.get('app.contract.hostname')}/contract/${result.hash}?t=${key}`, config.get('email.from'));
  req.context.email.sendNewContractCreated(req.context, contact_email, message);

  res.json({ success: result._id });
});

export default router;