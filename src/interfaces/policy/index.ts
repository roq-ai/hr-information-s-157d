import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface PolicyInterface {
  id?: string;
  policy_details?: string;
  handbook?: string;
  workflow?: string;
  company_id?: string;
  created_at?: any;
  updated_at?: any;

  company?: CompanyInterface;
  _count?: {};
}

export interface PolicyGetQueryInterface extends GetQueryInterface {
  id?: string;
  policy_details?: string;
  handbook?: string;
  workflow?: string;
  company_id?: string;
}
