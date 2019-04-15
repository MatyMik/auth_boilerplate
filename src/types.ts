import { Request } from 'express';
import { ObjectID } from "mongodb";
import { Context } from './context';
export { Context } from './context';

export type ContextualRequest = Request & { context: Context; rawBody: Buffer };

export type Delta<T> = { [key in keyof T]?: T[key] };

export type User = {
  _id: string;
  name: string;
  email: string;
  disabled: boolean;
  suspended: boolean;
  password: string | null;
};

export type Contract = {
  _id: ObjectID | string;
  created_by: ObjectID | string;
  created_at: number;
  status: string;
};

export enum ContractStatus {
  NEW = "NEW"
};