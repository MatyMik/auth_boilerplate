import { Db, ObjectID } from "mongodb";
import { User } from '../../types';

const collection = "users";

export const findById = (db: Db) => async (id: string): Promise<User> => {
  const user: User = await db.collection(collection).findOne({ _id: new ObjectID(id) });
  return user;
};

export const findByEmail = (db: Db) => async (email: string): Promise<User> => {
  const user: User = await db.collection(collection).findOne({ email });
  return user;
};

export default (db: Db) => ({
  findById: findById(db),
  findByEmail: findByEmail(db)
});
