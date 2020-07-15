import { Db } from "mongodb";
import { Contract } from "../../types";
import { NotFoundError } from "../../utils/errors";

const collection = "contracts";

export const findByHash = (db: Db) => async (hash: string): Promise<Contract> => {
  const contract: Contract = await db.collection(collection).findOne({ hash });
  return contract;
};

export const findByHashAndSecret = (db: Db) => async (hash: string, key: string): Promise<Contract> => {
  const contract: Contract = await db.collection(collection).findOne({ hash, key });
  return contract;
};

export const findByHashAndToken = (db: Db) => async (hash: string, token: string): Promise<Contract> => {
  const contract: Contract = await db.collection(collection).findOne({ hash, token });
  return contract;
};

export const findByHashAndKeyAndRefresh = (db: Db) => async (hash: string, key: string, refresh: string): Promise<Contract> => {
  const contract: Contract = await db.collection(collection).findOne({ hash, key, refresh });
  return contract;
};

export const update = (db: Db) => async (hash: string, body: any) => {
  await db.collection(collection).updateOne({ hash }, { $set: body })
};

export const addHistory = (db: Db) => async (hash: string, history: any) => {
  await db.collection(collection).updateOne({ hash }, { $push: { history } })
};

export default (db: Db) => ({
  findByHash: findByHash(db),
  findByHashAndToken: findByHashAndToken(db),
  findByHashAndKeyAndRefresh: findByHashAndKeyAndRefresh(db),
  findByHashAndSecret: findByHashAndSecret(db),
  update: update(db),
  addHistory: addHistory(db)
});
