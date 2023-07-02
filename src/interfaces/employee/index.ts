import { AttendanceInterface } from 'interfaces/attendance';
import { BenefitsInterface } from 'interfaces/benefits';
import { OffboardingInterface } from 'interfaces/offboarding';
import { OnboardingInterface } from 'interfaces/onboarding';
import { PayrollInterface } from 'interfaces/payroll';
import { PerformanceInterface } from 'interfaces/performance';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface EmployeeInterface {
  id?: string;
  personal_details?: string;
  work_details?: string;
  emergency_contacts?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  attendance?: AttendanceInterface[];
  benefits?: BenefitsInterface[];
  offboarding?: OffboardingInterface[];
  onboarding?: OnboardingInterface[];
  payroll?: PayrollInterface[];
  performance?: PerformanceInterface[];
  user?: UserInterface;
  _count?: {
    attendance?: number;
    benefits?: number;
    offboarding?: number;
    onboarding?: number;
    payroll?: number;
    performance?: number;
  };
}

export interface EmployeeGetQueryInterface extends GetQueryInterface {
  id?: string;
  personal_details?: string;
  work_details?: string;
  emergency_contacts?: string;
  user_id?: string;
}
