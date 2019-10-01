import { genSalt, hash as createHash } from "bcrypt";

const create = async (newPassword: string) => {
  const salt = await genSalt(10);
  const hash = await createHash(newPassword, salt);
  console.log(hash);
} 


create("developer");
