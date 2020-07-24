import { ContextualRequest } from '../types';
import { PermissionError } from '../utils/errors';

export const getDatabaseName = async (req: ContextualRequest): Promise<PermissionError | string> => {
  const domain = req.headers["x-domain"] as string;
  const customer = await req.context.models.customer.findByDomain(domain);
  if (!customer) throw new PermissionError();
  return customer.dbname;
}