import config from 'config';
import { Db } from 'mongodb';
import * as logger from './services/logger';
import initDB from './services/db';
import initModels from './services/models';
import * as jwt from './services/jwt';
import * as email from './services/email';
import { User } from './types'

export type Context = {
  config: any;
  logger: typeof logger;
  db: Db;
  models: ReturnType<typeof initModels>;
  jwt: typeof jwt;
  user?: User;
  email: typeof email;
};

export const create = async (): Promise<Context> => {
  const db = await initDB(config.get("db"));
  const models = await initModels(db);
  const context = { config, logger, db, models, jwt, email };
  return context;
};
