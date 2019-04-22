import Joi from 'joi';
import { ContractRegion, ContractType } from '../types';

export const ContractSchema = Joi.object({
  region: Joi.string().valid(Object.values(ContractRegion)).required(),
  type: Joi.string().valid(Object.values(ContractType)).required(),
  project_name: Joi.string().required(),
  requester_name: Joi.string().required(),
  contact_name: Joi.string().required(),
  contact_email: Joi.string().required(),
  description: Joi.string().allow("")
});