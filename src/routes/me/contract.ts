import { Router, Response } from 'express';
import Joi from 'joi';
import config from 'config';
import { param } from '../../middlewares/validate';
import { pickBaseContractProperties } from '../../utils/pick';
import { ContextualRequest, Contract  } from '../../types';
import mailTemplate from '../../utils/emailTemplates/new-contract-customer';
import mailTemplateRequestNewToken from '../../utils/emailTemplates/request-new-token';

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
    delete result.token;
    delete result.refresh;
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

router.put('/:hash/add-event', 
  param('hash', Joi.string()),
  async (req: ContextualRequest, res: Response) => {
    const hash = req.params.hash;
    await req.context.models.contract.addHistory(hash, { ...req.body, userId: req.context.user._id })
    res.json({ ok: true });
});

router.get('/:hash/resend-invitation', 
  param('hash', Joi.string()),
  async (req: ContextualRequest, res: Response) => {
    const hash = req.params.hash;
    const contract = await req.context.models.contract.findByUserAndHash(req.context.user._id, hash);
    const message = mailTemplate(`${config.get('app.contract.hostname')}/contract/${contract.hash}?t=${contract.key}`, config.get('email.from'));
    req.context.email.sendNewContractCreated(req.context, contract.contact_email, message);
    res.json({ok: true});
});

router.get('/:hash/send-new-token-request', 
  param('hash', Joi.string()),
  async (req: ContextualRequest, res: Response) => {
    const hash = req.params.hash;
    const contract = await req.context.models.contract.findByUserAndHash(req.context.user._id, hash);

    const nextRefreshToke = await req.context.jwt.createRefreshToken(hash);
    await req.context.models.contract.update(req.context.user._id, hash, { refresh: nextRefreshToke });
    await req.context.models.contract.addHistory(hash, { action: "SET_REFRESH_TOKEN_BY_ADMIN", at: Date.now(), userId: req.context.user._id })
    
    const message = mailTemplateRequestNewToken(`${config.get('app.contract.hostname')}/refresh-token/${contract.hash}?t=${contract.key}&r=${nextRefreshToke}`, config.get('email.from'))
    await req.context.email.sendNewRefreshToken(req.context, contract.contact_email, message)
    res.json({ok: true});
});

export default router;
