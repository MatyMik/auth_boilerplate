import config from "config";
import * as logger from "./services/logger";
import { UserService } from "./services/UserService";
import { Connection, getConnection } from "typeorm";
import { connection } from "./services/db";

export type Context = {
  config: any;
  logger: typeof logger;
  userService: UserService;
  db: Connection;
};

export const create = async (): Promise<Context> => {
  const userService = new UserService();
  const context = { config, logger, userService: userService, db: await connection() };
  return context;
};
