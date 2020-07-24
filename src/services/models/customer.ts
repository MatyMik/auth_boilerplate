import { MongoClient, ObjectID } from "mongodb";
import config from "config";
import { Customer } from '../../types';

const collection = "customers";
const { database } = config.get("db");

export const findById = (connection: MongoClient) => async (id: string | ObjectID): Promise<Customer> => {
  const _id = typeof id === "string" ? new ObjectID(id) : id;
  return await connection.db(database).collection(collection).findOne({ _id });
};

export const findByDomain = (connection: MongoClient) => async (domain: string): Promise<Customer> => {
  return await connection.db(database).collection(collection).findOne({ domain });
};

export default (connection: MongoClient) => ({
  findById: findById(connection),
  findByDomain: findByDomain(connection)
});
