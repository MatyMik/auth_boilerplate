import { Request } from 'express';
import { ObjectID } from "mongodb";
import { Context } from './context';

export type ContextualRequest = Request & { context: Context; rawBody: Buffer };

export type Delta<T> = { [key in keyof T]?: T[key] };

export type UserInput = {
  name: string;
  username: string;
  email: string;
  disabled: boolean;
  suspended: boolean;
  password?: string | null;
};

export type User = {
  _id: ObjectID | string;
} & UserInput;

export type ContractHistory = {
  _id: string;
  name: string;
  username: string;
  action: string;
  at: number;
};

export type ContractAssignedUser = {
  _id: string;
  name: string;
  username: string;
  role: string;
};

export type ContractInput = {
  region: string;
  type: string;
  created_by: ObjectID | string;
  assigned?: ContractAssignedUser[];
  history?: ContractHistory[];
};

export enum ContractRegion {
  HUNGARY = "hun",
  NOT_HUNGARY = "not_hun"
}

export enum ContractType {
  PRIVATE_PERSON = "private_person",
  COMPANY = "company"
}

export type Contract = {
  _id: ObjectID | string;
} & ContractInput;

export type Client = {
  _id: ObjectID | string;
  created_by: ObjectID | string;
  created_at: number;
  name: string;
};

export enum Status {
  NEW = "NEW"
};

export * from './context';