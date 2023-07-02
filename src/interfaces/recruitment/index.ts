import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface RecruitmentInterface {
  id?: string;
  job_post?: string;
  applications?: string;
  company_id?: string;
  created_at?: any;
  updated_at?: any;

  company?: CompanyInterface;
  _count?: {};
}

export interface RecruitmentGetQueryInterface extends GetQueryInterface {
  id?: string;
  job_post?: string;
  applications?: string;
  company_id?: string;
}
