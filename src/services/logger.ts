import config from 'config';

const log = (level: keyof Console, enabled: boolean = true) => (...args: any[]) => {
  if (!enabled) return;
  const date = new Date();
  console[level](date.toISOString(), '-', ...args);
};

export const debug = log('debug', config.get('logger.debugEnabled'));
export const info = log('info', true);
export const error = log('error', true);

process.on('unhandledRejection', error);
