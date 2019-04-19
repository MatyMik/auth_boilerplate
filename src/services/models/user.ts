import { Db, ObjectID, InsertOneWriteOpResult } from "mongodb";
import { User, Status, UserInput } from '../../types';

const collection = "users";

export const findById = (db: Db) => async (id: string | ObjectID): Promise<User> => {
  const _id = typeof id === "string" ? new ObjectID(id) : id;
  const user: User = await db.collection(collection).findOne({ _id });
  return user;
};

export const findByEmail = (db: Db) => async (email: string): Promise<User> => {
  const user: User = await db.collection(collection).findOne({ email });
  return user;
};

export const findByUsername = (db: Db) => async (username: string): Promise<User> => {
  const user: User = await db.collection(collection).findOne({ username });
  return user;
};

export const create = (db: Db) => async (user: UserInput): Promise<User> => {
  const { insertedId: id }: InsertOneWriteOpResult = await db.collection(collection).insertOne({
    ...user,
    status: Status.NEW,
    created_at: Date.now()
  });
  
  return await findById(db)(id);
}

export default (db: Db) => ({
  findById: findById(db),
  findByEmail: findByEmail(db),
  findByUsername: findByUsername(db),
  create: create(db)
});
