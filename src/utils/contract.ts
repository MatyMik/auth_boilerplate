import uuid from "uuid";
import { ContractType, Contract, Status } from "../types";

export const defaultPrivatePersonContract = (created_by: string | null = null): Contract => ({
  hash: uuid(),
  region: "",
  created_by,
  type: ContractType.PRIVATE_PERSON,
  project_name: "",
  status: Status.NEW,
  sections: {},
  validation: {}
});

export const defaultCompanyContract = (created_by: string | null = null): Contract => ({
  hash: uuid(),
  region: "",
  created_by,
  type: ContractType.COMPANY,
  project_name: "",
  status: Status.NEW,
  sections: {},
  validation: {}
});