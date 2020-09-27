import config from "config";
import * as logger from "./services/logger";
import { UserService } from "./services/UserService";

export type Context = {
  config: any;
  logger: typeof logger;
  userService: UserService;
};

export const create = (): Context => {
  const userService = new UserService();
  const context = { config, logger, userService: userService };
  return context;
};
