import uuid from "uuid";
import { ContractType, Contract, Status } from "../types";

export const defaultPrivatePersonContract = (created_by: string | null = null): Contract => ({
  hash: uuid(),
  region: "",
  created_by,
  type: ContractType.PRIVATE_PERSON,
  project_name: "",
  signatory: {
    first_name: "",
    last_name: "",
    birth_name: "",
    birth_date: "",
    birth_place: "",
    mothers_name: "",
    nationality: "",
    address: "",
    id_type: "",
    phone: "",
    email: "",
    uploads: null,
    position: "",
    independent_representation: ""
  },
  status: Status.NEW,
  number_of_fields: 12
});

export const defaultCompanyContract = (created_by: string | null = null): Contract => ({
  hash: uuid(),
  region: "",
  created_by,
  type: ContractType.COMPANY,
  project_name: "",
  entity: {
    entity: "",
    name: "",
    tax_number: "",
    eu_tax_number: "",
    main_activity: "",
    representations: "",
    trustee: "",
    uploads: null,
  },
  signatory: {
    first_name: "",
    last_name: "",
    birth_name: "",
    birth_date: "",
    birth_place: "",
    mothers_name: "",
    nationality: "",
    address: "",
    id_type: "",
    phone: "",
    email: "",
    uploads: null,
    position: "",
    independent_representation: ""
  },
  contact: {
    first_name: "",
    last_name: "",
    address: "",
    phone: "",
    email: ""
  },
  owner: {
    type: "",
    first_name: "",
    last_name: "",
    birth_name: "",
    birth_date: "",
    birth_place: "",
    mothers_name: "",
    nationality: "",
    address: "",
    nature_and_extent: "",
    is_public_figure: false,
    public_role: "",
    uploads: null
  },
  status: Status.NEW,
  number_of_fields: 41
});