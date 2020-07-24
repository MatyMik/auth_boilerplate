import { MongoClient } from "mongodb";
import contracts from "./contract";
import customer from "./customer";

export default (connection: MongoClient) => ({
  contract: contracts(connection),
  customer: customer(connection)
});
