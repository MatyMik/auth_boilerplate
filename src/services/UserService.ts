import { getConnection } from "typeorm";
import { User } from "../models/User";

interface IUser {
  email?: string;
  password?: string;
}

export class UserService {
  async findOneById(id: number) {
    await getConnection()
      .createQueryBuilder()
      .select("user")
      .from(User, "user")
      .where("user.id = :id", { id })
      .getOne();
  }

  async save(user: User) {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(user)
      .execute();
  }
  async update(id: number, newProp: IUser) {
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set(newProp)
      .where("id = :id", { id })
      .execute();
  }
}
