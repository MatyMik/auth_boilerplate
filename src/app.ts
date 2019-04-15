import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import auth from './middlewares/auth';
import contextMiddleware from './middlewares/context';
import errorMiddleware from './middlewares/error';
import discovery from './utils/discovery';
import { Context } from './types';

import login from './routes/login';
import me from './routes/me';

export default (context: Context) => {
  const app = express();

  app.use(cors());
  if (context.config.get('morgan.enabled')) app.use(morgan(context.config.get('morgan.pattern')));
  app.use(bodyParser.json({ verify: (req, res, buf) => ((req as any).rawBody = buf) }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(contextMiddleware(context));
  app.use(passport.initialize());

  const api = express.Router();
  api.use('/login', login);
  api.use('/me', auth('user'), me);
  
  app.use('/', api);
  app.use('/api', api);
  app.use(errorMiddleware);
  discovery(api);

  return app;
};
