import config from 'config';
import { Db } from 'mongodb';
import * as logger from './services/logger';
import initDB from './services/db';
import * as jwt from './services/jwt';
import * as email from './services/email';
import initModels from './services/models';

export type Context = {
  config: any;
  logger: typeof logger;
  db: Db;
  models: ReturnType<typeof initModels>;
  jwt: any;
  email: any;
};

export const create = async (): Promise<Context> => {
  const db = await initDB(config.get("db"));
  const models = await initModels(db);
  const context = { config, logger, db, models, jwt, email };
  return context;
};
