import { EmployeeInterface } from 'interfaces/employee';
import { GetQueryInterface } from 'interfaces';

export interface OffboardingInterface {
  id?: string;
  exit_interview?: string;
  final_settlement?: number;
  employee_id?: string;
  created_at?: any;
  updated_at?: any;

  employee?: EmployeeInterface;
  _count?: {};
}

export interface OffboardingGetQueryInterface extends GetQueryInterface {
  id?: string;
  exit_interview?: string;
  employee_id?: string;
}
