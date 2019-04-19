import Joi from 'joi';
import { ContractRegion, ContractType } from '../types';

export const ContractSchema = Joi.object({
  region: Joi.string().valid(Object.values(ContractRegion)).required(),
  type: Joi.string().valid(Object.values(ContractType)).required(),
  name: Joi.string().required(),
  email: Joi.string().email({ minDomainAtoms: 2 }).required()
});