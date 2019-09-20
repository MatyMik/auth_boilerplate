import {Contract} from '../types';
export const pickBaseContractProperties = (contract : Contract) => {
  const { sections, validation, ...base } = contract;
  return base;
}