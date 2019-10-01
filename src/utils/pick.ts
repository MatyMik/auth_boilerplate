import {Contract} from '../types';
export const pickBaseContractProperties = (contract : Contract) => {
  const { sections, validation, key, token, history, refresh, ...base } = contract;
  return base;
}