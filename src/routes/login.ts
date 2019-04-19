import { Response, Router } from 'express';
import Joi from 'joi';
import { body } from '../middlewares/validate';
import auth from '../middlewares/auth';
import { ContextualRequest } from '../types';

const router = Router();

const loginHandler = async (req: ContextualRequest, res: Response) => {
  const jwt = await req.context.jwt.createAuthToken(req.context.user._id);
  res.cookie('jwt', jwt).json({ me: req.context.user, jwt });
};

router.post(
  '/',
  body(
    Joi.object({
      username: Joi.string()
        .required(),
      password: Joi.string()
        .base64()
        .required()
    })
  ),
  auth('user', 'local'),
  loginHandler
);

router.put('/', auth('user', 'jwt'), loginHandler);

export default router;
