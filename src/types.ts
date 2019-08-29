import { Request } from 'express';
import { ObjectID } from "mongodb";
import { Context } from './context';
import { boolean } from 'joi';

export type ContextualRequest = Request & { context: Context; rawBody: Buffer };

export type Delta<T> = { [key in keyof T]?: T[key] };

export enum UserRole {
  MANAGER = "MANAGER",
  ENTITY = "ENTITY"
};

export type User = {
  _id: ObjectID | string;
  name: string;
  username: string;
  email: string;
  disabled: boolean;
  suspended: boolean;
  password?: string | null;
  role: UserRole;
};

export enum ContractRegion {
  HUNGARY = "hun",
  NOT_HUNGARY = "not_hun"
};

export enum ContractType {
  PRIVATE_PERSON = "private_person",
  COMPANY = "company"
};

export type ContractSignatory = {
  first_name: string;
  last_name: string;
  birth_name: string;
  birth_date: string;
  birth_place: string;
  mothers_name: string;
  nationality: string;
  address: string;
  id_type: string;
  phone: string;
  email: string;
  uploads: any[] | null;
  position?: string;
  independent_representation?: string;
};

export type ContractEntity = {
  entity: string;
  name: string;
  tax_number: string;
  eu_tax_number: string;
  main_activity: string;
  representations: string;
  trustee: string;
  uploads: any[] | null;
}

export type ContractContact = {
  first_name: string;
  last_name: string;
  address: string;
  phone: string;
  email: string;
}

export type ContractOwner = {
  type: string;
  first_name?: string;
  last_name?: string;
  birth_name?: string;
  birth_date?: string;
  birth_place?: string;
  mothers_name?: string;
  nationality?: string;
  address?: string;
  nature_and_extent?: string;
  is_public_figure?: boolean;
  public_role?: string;
  uploads: any[] | null;
}

export type ContractHistory = {
  _id: string;
  name: string;
  username: string;
  action: string;
  at: number;
};

export type ContractAssignedUser = {
  _id?: string;
  name: string;
  username?: string;
  email?: string;
  role: string;
};

export type Contract = {
  _id?: ObjectID | string;
  hash: string;
  region: string;
  type: string;
  project_name: string;
  description?: string;
  created_by: ObjectID | string | null;
  assigned?: ContractAssignedUser[];
  history?: ContractHistory[];
  status: string;
};

export type Client = {
  _id: ObjectID | string;
  created_by: ObjectID | string;
  created_at: number;
  name: string;
};

export enum Status {
  NEW = "NEW",
  IN_PROGRESS = "IN PROGRESS",
  FINISHED = "FINISHED"
};

export * from './context';