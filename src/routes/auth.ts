import { Router, Response } from 'express';
import uuid from "uuid";
import config from "config";
import crypto from 'crypto';
import { ContextualRequest, Status } from '../types';
import mailTemplateRequestNewToken from '../utils/emailTemplates/request-new-token';
import mailTemplateSetNewToken from '../utils/emailTemplates/set-new-token';
import { AuthorizationError, PermissionError } from '../utils/errors';
import { decodeBase64ToJson } from '../utils/encrypt';
import { getDatabaseName } from '../utils/customer';

const router = Router();
router.post('/',
  async (req: ContextualRequest, res: Response) => {
    const dbName = await getDatabaseName(req) as string;
    const { token, hash, key, ipv4 } = decodeBase64ToJson(req.body.data);
    // if token not exists from cookie or header
    if (!token) {
      const contract = await req.context.models.contract.findByHashAndSecret(dbName, hash, key);
      if (!contract) throw new PermissionError();
      await req.context.models.contract.addHistory(dbName, hash, { action: "AUTH", at: Date.now(), ip: ipv4, status: contract.status })
      if (contract.status === Status.NEW || contract.status === Status.NEW_TOKEN) {
        const nextToken = await req.context.jwt.createToken(hash);
        const nextStatus = contract.status === Status.NEW ? Status.VIEWED : Status.IN_PROGRESS;
        await req.context.models.contract.update(dbName, hash, { token: nextToken, status: nextStatus });
        await req.context.models.contract.addHistory(dbName, hash, { action: "SET_NEW_AUTH_TOKEN", at: Date.now(), ip: ipv4, status: contract.status })
        res.json({ token: nextToken });
      }
      else if (contract.status === Status.FINISHED) throw new PermissionError();
      else throw new PermissionError();
      // if cookie exists
    } else {
      const contractByToken = await req.context.models.contract.findByHashAndToken(dbName, hash, token);
      const contractByKey = await req.context.models.contract.findByHashAndSecret(dbName, hash, key);
      // if contract not exists by key or token
      if (!contractByKey && !contractByToken) throw new AuthorizationError();
      // if contract exist by key but not token (old browser token), create a new token via NEW status
      if (!contractByToken && contractByKey) {
        if (contractByKey.status === Status.NEW) {
          const nextToken = await req.context.jwt.createToken(hash);
          await req.context.models.contract.update(dbName, hash, { token: nextToken, status: Status.VIEWED });
          await req.context.models.contract.addHistory(dbName, hash, { action: "SET_NEW_AUTH_TOKEN", at: Date.now(), ip: ipv4, status: contractByKey.status })
          res.json({ token: nextToken });
        } else throw new PermissionError();
      }
      // if contract exists by token, need to validate token and refresh it
      if (contractByToken) {
        try {
          await req.context.jwt.resolveToken(token);
        } catch (e) {
          await req.context.models.contract.addHistory(dbName, hash, { action: "BAD_AUTH_TOKEN", at: Date.now(), ip: ipv4 })
          throw new PermissionError();
        }

        if (contractByToken.status === Status.FINISHED) throw new PermissionError();
        const nextToken = await req.context.jwt.createToken(hash);
        await req.context.models.contract.update(dbName, hash, { token: nextToken });
        await req.context.models.contract.addHistory(dbName, hash, { action: "SET_NEW_AUTH_TOKEN", at: Date.now(), ip: ipv4, status: contractByToken.status })
        res.json({ token: nextToken });
      }
    }
  });

router.post('/refresh',
  async (req: ContextualRequest, res: Response) => {
    const dbName = await getDatabaseName(req) as string;
    const { hash, key, ipv4 } = decodeBase64ToJson(req.body.data);
    await req.context.models.contract.addHistory(dbName, hash, { action: "VIEW_SET_REFRESH_TOKEN_PAGE", at: Date.now(), ip: ipv4, hash, key })
    const contract = await req.context.models.contract.findByHashAndSecret(dbName, hash, key);
    if (!contract) {
      await req.context.models.contract.addHistory(dbName, hash, { action: "SET_REFRESH_TOKEN_MISSING_CONTRACT", at: Date.now(), ip: ipv4, hash, key })
      throw new PermissionError();
    }

    const nextRefreshToke = await req.context.jwt.createRefreshToken(hash);
    await req.context.models.contract.update(dbName, hash, { refresh: nextRefreshToke });
    await req.context.models.contract.addHistory(dbName, hash, { action: "SET_REFRESH_TOKEN", at: Date.now(), ip: ipv4, hash, key, nextRefreshToke })

    const message = mailTemplateRequestNewToken(`${config.get('app.hostname')}/refresh-token/${hash}?t=${key}&r=${nextRefreshToke}`, config.get("email.from"))
    await req.context.email.sendNewRefreshToken(req.context, contract.contact_email, message, contract.project_name)
    res.json();
  });

router.post('/validate',
  async (req: ContextualRequest, res: Response) => {
    const dbName = await getDatabaseName(req) as string;
    const { hash, key, refreshToken, ipv4 } = decodeBase64ToJson(req.body.data);
    await req.context.models.contract.addHistory(dbName, hash, { action: "VIEW_SET_NEW_HASH_PAGE", at: Date.now(), ip: ipv4, hash, key })
    const contract = await req.context.models.contract.findByHashAndKeyAndRefresh(dbName, hash, key, refreshToken);
    if (!contract) {
      await req.context.models.contract.addHistory(dbName, hash, { action: "SET_NEW_HASH_MISSING_CONTRACT", at: Date.now(), ip: ipv4, hash })
      throw new PermissionError();
    }

    try {
      await req.context.jwt.resolveRefreshToken(refreshToken);
    } catch (e) {
      await req.context.models.contract.addHistory(dbName, hash, { action: "BAD_REFRESH_TOKEN", at: Date.now(), ip: ipv4, hash })
      throw new PermissionError();
    }

    const nextHash = uuid();
    const nextKey = crypto.randomBytes(64).toString('hex');
    await req.context.models.contract.update(dbName, hash, {
      hash: nextHash,
      key: nextKey,
      status: Status.NEW_TOKEN,
      refresh: undefined,
      token: undefined,
    });

    await req.context.models.contract.addHistory(dbName, nextHash, { action: "SET_NEW_HASH", at: Date.now(), ip: ipv4, hash, nextHash })
    const message = mailTemplateSetNewToken(`${config.get('app.hostname')}/contract/${nextHash}?t=${nextKey}`, config.get("email.from"))
    await req.context.email.sendNewHash(req.context, contract.contact_email, message, contract.project_name)
    res.json();
  });


export default router;
