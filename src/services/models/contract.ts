import { Db, ObjectID, InsertOneWriteOpResult } from "mongodb";
import { Contract, Status } from "../../types";
import { NotFoundError } from "../../utils/errors";

const collection = "contracts";

export const find = (db: Db) => async (): Promise<Contract[]> => {
  const contracts: Contract[] = await db.collection(collection).find({}).toArray();
  return contracts;
};

export const findById = (db: Db) => async (id: string | Object): Promise<Contract> => {
  const _id = typeof id === "string" ? new ObjectID(id) : id;
  const contract: Contract = await db.collection(collection).findOne({ _id });
  return contract;
};

export const findByUser = (db: Db) => async (id: string | Object): Promise<Contract[]> => {
  const userId = typeof id === "string" ? new ObjectID(id) : id;
  const contracts: Contract[] = await db.collection(collection).find({ 
    $or: [{ created_by: userId }, { "assigned._id": userId.toString() }] 
  }).toArray();
  return contracts;
};

export const findByUserAndId = (db: Db) => async (userId: string | Object, hash: string): Promise<Contract> => {
  const nextUserId = typeof userId === "string" ? new ObjectID(userId) : userId;
  const contract: Contract = await db.collection(collection).findOne({
    $and: [ 
      { hash }, 
      { status: { $ne: Status.FINISHED }},
      // { $or: [{ created_by: nextUserId }, { "assigned._id": nextUserId.toString() }] } 
    ]
  });

  if (!contract) throw new NotFoundError("Contract not found");
  return contract;
};

export const findByUserAndHash= (db: Db) => async (userId: string | Object, hash: string): Promise<Contract> => {
  const nextUserId = typeof userId === "string" ? new ObjectID(userId) : userId;
  const contract: Contract = await db.collection(collection).findOne({
    $and: [ 
      { hash }
    ]
  });

  if (!contract) throw new NotFoundError("Contract not found");
  return contract;
};

export const create = (db: Db) => async (contract: any): Promise<Contract> => {
  const { insertedId: id }: InsertOneWriteOpResult = await db.collection(collection).insertOne({
    ...contract,
    created_at: Date.now()
  });
  
  return await findById(db)(id);
};

export const update = (db: Db) => async (userId: string | Object, hash: string, set: any): Promise<Contract> => {
  const nextUserId = typeof userId === "string" ? new ObjectID(userId) : userId;
  await db.collection(collection).updateOne({ hash }, { $set: set });
  return await findByUserAndHash(db)(nextUserId, hash);
};

export const addHistory = (db: Db) => async (hash: string, history: any) => {
  await db.collection(collection).updateOne({ hash }, { $push: { history } })
};

export default (db: Db) => ({
  find: find(db),
  findById: findById(db),
  findByUserAndId: findByUserAndId(db),
  findByUserAndHash: findByUserAndHash(db),
  findByUser: findByUser(db),
  create: create(db),
  update: update(db),
  addHistory: addHistory(db)
});
