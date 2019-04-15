import { Db, ObjectID, InsertOneWriteOpResult } from "mongodb";
import { Contract, ContractStatus } from "../../types";

const collection = "contracts";

export const findById = (db: Db) => async (id: string | Object): Promise<Contract> => {
  const _id = typeof id === "string" ? new ObjectID(id) : id;
  const contract: Contract = await db.collection(collection).findOne({ _id });
  return contract;
};

export const findByUser = (db: Db) => async (id: string): Promise<Contract[]> => {
  const contracts: Contract[] = await db.collection(collection).find({ created_by: new ObjectID(id) }).toArray();
  return contracts;
};

export const create = (db: Db) => async (contract: any): Promise<Contract> => {
  const { insertedId: id }: InsertOneWriteOpResult = await db.collection(collection).insertOne({
    ...contract,
    status: ContractStatus.NEW,
    created_at: Date.now()
  });
  
  return await findById(db)(id);
};

export default (db: Db) => ({
  findById: findById(db),
  findByUser: findByUser(db),
  create: create(db)
});
