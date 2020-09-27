import config from "config";
import * as logger from "./services/logger";
import createConnection from "./services/db";
import { UserService } from "./services/UserService";

export type Context = {
  config: any;
  logger: typeof logger;
  userService: UserService;
};

export const create = async (): Promise<Context> => {
  const userService = new UserService();
  const context = { config, logger, userService: userService };
  return context;
};
