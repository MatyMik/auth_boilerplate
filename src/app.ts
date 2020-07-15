import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import contextMiddleware from './middlewares/context';
import errorMiddleware from './middlewares/error';
import auth from './middlewares/auth';
import contractRoutes from './routes/contract';
import authRoutes from './routes/auth';
import discovery from './utils/discovery';
import { Context } from './types';

export default (context: Context) => {
  const app = express();

  app.use(cors());
  if (context.config.get('morgan.enabled')) app.use(morgan(context.config.get('morgan.pattern')));
  app.use(express.json({limit: '300mb'}));
  app.use(express.urlencoded({limit: '300mb'}));
  app.use(bodyParser.json({limit: '300mb'}));
  app.use(bodyParser.urlencoded({limit: '300mb', extended: true}));
  app.use(cookieParser());
  app.use(contextMiddleware(context));

  const api = express.Router();
  api.use('/auth', authRoutes);
  api.use('/contract', auth, contractRoutes);
  app.use('/', api);
  app.use('/api', api);
  app.use(errorMiddleware);
  discovery(api);
  return app;
};
