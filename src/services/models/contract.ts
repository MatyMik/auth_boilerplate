import { MongoClient } from "mongodb";
import { Contract } from "../../types";

const collection = "contracts";

export const findByHash = (connection: MongoClient) => async (db: string, hash: string): Promise<Contract> => {
  const contract: Contract = await connection.db(db).collection(collection).findOne({ hash });
  return contract;
};

export const findByHashAndSecret = (connection: MongoClient) => async (db: string, hash: string, key: string): Promise<Contract> => {
  const contract: Contract = await connection.db(db).collection(collection).findOne({ hash, key });
  return contract;
};

export const findByHashAndToken = (connection: MongoClient) => async (db: string, hash: string, token: string): Promise<Contract> => {
  const contract: Contract = await connection.db(db).collection(collection).findOne({ hash, token });
  return contract;
};

export const findByHashAndKeyAndRefresh = (connection: MongoClient) => async (db: string, hash: string, key: string, refresh: string): Promise<Contract> => {
  const contract: Contract = await connection.db(db).collection(collection).findOne({ hash, key, refresh });
  return contract;
};

export const update = (connection: MongoClient) => async (db: string, hash: string, body: any) => {
  await connection.db(db).collection(collection).updateOne({ hash }, { $set: body })
};

export const addHistory = (connection: MongoClient) => async (db: string, hash: string, history: any) => {
  await connection.db(db).collection(collection).updateOne({ hash }, { $push: { history } })
};

export default (connection: MongoClient) => ({
  findByHash: findByHash(connection),
  findByHashAndToken: findByHashAndToken(connection),
  findByHashAndKeyAndRefresh: findByHashAndKeyAndRefresh(connection),
  findByHashAndSecret: findByHashAndSecret(connection),
  update: update(connection),
  addHistory: addHistory(connection)
});
