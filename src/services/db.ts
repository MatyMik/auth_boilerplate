import { MongoClient } from "mongodb";

export type DbOptions = {
  host: string;
  port: number;
  database: string;
};

export default async ({ host, port }: DbOptions): Promise<MongoClient> => {
  try {
    const uri = `mongodb://${host}:${port}`
    const connection: MongoClient = await MongoClient.connect(uri, { useNewUrlParser: true });
    return connection;
  } catch (error) { throw error; }
};