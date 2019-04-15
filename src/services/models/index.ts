import { Db } from "mongodb";
import users from "./user";
import contracts from "./contract";

export default (db: Db) => ({
  user: users(db),
  contract: contracts(db)
});
