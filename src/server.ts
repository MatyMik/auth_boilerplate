import http from 'http';
import initApp from './app';
import { Context } from './types';

export const start = async (context: Context): Promise<http.Server> => {
  const port = context.config.get('server.port');
  const app = initApp(context);
  const server = http.createServer(app);

  await new Promise((resolve) =>
    server.listen(port, () => {
      resolve(server);
    })
  );

  context.logger.info(`Server listens on http://localhost:${port}`);
  return server;
};
