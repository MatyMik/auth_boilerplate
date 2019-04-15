import { MongoClient, Db } from "mongodb";

export type DbOptions = {
  host: string;
  port: number;
  database: string;
};

export default async ({ host, port, database }: DbOptions): Promise<Db> => {
  try {
    const uri = `mongodb://${host}:${port}`
    const connection: MongoClient = await MongoClient.connect(uri, { useNewUrlParser: true });
    const db: Db = connection.db(database);
    return db;
  } catch(error) { throw error; }
};