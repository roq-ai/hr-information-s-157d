import * as yup from 'yup';

export const employeeValidationSchema = yup.object().shape({
  personal_details: yup.string(),
  work_details: yup.string(),
  emergency_contacts: yup.string(),
  user_id: yup.string().nullable(),
});
