import { createConnection } from "typeorm";
import { User } from "../models/User";
import { Session } from "../models/Session";
import config from "config";

const { host, username, password, db, port } = config.get("db");
const pgHost = process.env.POSTGRES_HOST || host;
const pgPort = process.env.POSTGRES_PORT || port;
const pgPassword = process.env.POSTGRES_PASSWORD || password;
const pgDb = process.env.POSTGRES_DB || db;
const pgUsername = process.env.POSTGRES_USER || username;

const url = `postgres://${pgUsername}:${pgPassword}@${pgHost}:${pgPort}/${pgDb}`;
console.log(url);
export const connection = async () => {
  try {
    return await createConnection({
      type: "postgres",
      url,
      entities: [User, Session],
    });
  } catch (err) {
    return err;
  }
};
