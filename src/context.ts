import config from 'config';
import * as logger from './services/logger';

export type Context = {
  config: any;
  logger: typeof logger;
};

export const create = async (): Promise<Context> => {
  const context = { config, logger };
  return context;
};
