import { EmployeeInterface } from 'interfaces/employee';
import { GetQueryInterface } from 'interfaces';

export interface BenefitsInterface {
  id?: string;
  benefit_details?: string;
  employee_id?: string;
  created_at?: any;
  updated_at?: any;

  employee?: EmployeeInterface;
  _count?: {};
}

export interface BenefitsGetQueryInterface extends GetQueryInterface {
  id?: string;
  benefit_details?: string;
  employee_id?: string;
}
