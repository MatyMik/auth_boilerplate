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
import contactRequest from './routes/contact-request';

export default (context: Context) => {
  const app = express();

  app.use(cors());
  if (context.config.get('morgan.enabled')) app.use(morgan(context.config.get('morgan.pattern')));
  app.use(express.json({limit: '50mb'}));
  app.use(express.urlencoded({limit: '50mb'}));
  app.use(bodyParser.json({ verify: (req, res, buf) => ((req as any).rawBody = buf) }));
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  app.use(bodyParser({limit: '50mb'}));
  app.use(cookieParser());
  app.use(contextMiddleware(context));
  app.use(passport.initialize());

  const api = express.Router();
  api.use('/login', login);
  api.use('/contact-request', contactRequest);
  api.use('/me', auth('user'), me);

  app.use('/', api);
  app.use('/api', api);
  app.use(errorMiddleware);
  discovery(api);

  return app;
};
