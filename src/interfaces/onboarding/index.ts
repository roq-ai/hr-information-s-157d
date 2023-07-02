import { EmployeeInterface } from 'interfaces/employee';
import { GetQueryInterface } from 'interfaces';

export interface OnboardingInterface {
  id?: string;
  paperwork?: string;
  induction?: string;
  employee_id?: string;
  created_at?: any;
  updated_at?: any;

  employee?: EmployeeInterface;
  _count?: {};
}

export interface OnboardingGetQueryInterface extends GetQueryInterface {
  id?: string;
  paperwork?: string;
  induction?: string;
  employee_id?: string;
}
