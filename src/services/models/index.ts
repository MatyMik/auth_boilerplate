import { Db } from "mongodb";
import contracts from "./contract";

export default (db: Db) => ({
  contract: contracts(db)
});
