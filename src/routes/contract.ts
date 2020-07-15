import { Router, Response } from 'express';
import Joi from 'joi';
import { param } from '../middlewares/validate';
import { getValidation } from '../utils/contract';
import { ContextualRequest, Status } from '../types';
import { encodeJsonToBase64, decodeBase64ToJson } from '../utils/encrypt';
import { PermissionError } from '../utils/errors';

const router = Router();
router.get('/:hash', 
  param('hash', Joi.string()),
  async (req: ContextualRequest, res: Response) => {
    const { hash } = req.params;
    const { authorization } = req.headers;
    const token = authorization.replace('Bearer ',"");
    const contract = await req.context.models.contract.findByHashAndToken(hash, token);
    if(!contract || contract.status === Status.FINISHED) throw new PermissionError();
    
    delete contract.token;
    delete contract.key;
    delete contract.refresh;
    delete contract.history;
    delete contract.assigned;
  
    res.json(encodeJsonToBase64({ ...contract }));
});

router.put('/:hash',
  async (req: ContextualRequest, res: Response) => {
    const { hash } = req.params;
    const { status, sections, ipv4 } = decodeBase64ToJson(req.body.data);
    const contract = await req.context.models.contract.findByHash(hash);
    if(!contract) throw new PermissionError();
    const validation = getValidation(contract, sections);
    if (status === Status.FINISHED) {
      await req.context.models.contract.addHistory(hash, { action: "SENT", at: Date.now(), ip: ipv4 });
      await req.context.models.contract.update(hash, { sections, validation, status, reopened: false });
      res.json(encodeJsonToBase64({ok: true }));
    } else {
      await req.context.models.contract.addHistory(hash, { action: "TRY_TO_SAVE", at: Date.now(), ip: ipv4 })
      await req.context.models.contract.update(hash, { sections, validation, status, reopened: false })
      const nextContract = await req.context.models.contract.findByHash(hash);
      await req.context.models.contract.addHistory(hash, { action: "SAVE_DONE", at: Date.now(), ip: ipv4 })
      res.json(encodeJsonToBase64(nextContract));
    }
});

router.post('/:hash',
  async (req: ContextualRequest, res: Response) => {
    const { hash } = req.params;
    const { body } = req;
    if (body.action) {
      await req.context.models.contract.addHistory(hash, body)
    }
    
    res.json({ ok: true });
});

export default router;
