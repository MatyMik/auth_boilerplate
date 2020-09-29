import { getConnection } from "typeorm";
import { User } from "../models/User";
import { comparePassword } from "../utils/encrypt";

interface IUser {
  email?: string;
  password?: string;
}

export class UserService {
  async findOneById(id: number) {
    return await getConnection()
      .createQueryBuilder()
      .select("user")
      .from(User, "user")
      .where("user.id = :id", { id })
      .getOne();
  }

  async findOneByEmail(email: string) {
    return await getConnection()
      .createQueryBuilder()
      .select("user")
      .from(User, "user")
      .where("user.email = :email", { email })
      .getOne();
  }

  async update(id: number, newProp: IUser) {
    return await getConnection()
      .createQueryBuilder()
      .update(User)
      .set(newProp)
      .where("id = :id", { id })
      .execute();
  }
  async validatePassword(password: string, userPassword: string) {
    return await comparePassword(password, userPassword);
  }

  async addNewUser(email: string, password: string, username: string) {
    return await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({ email, password, username })
      .execute();
  }
}
