import * as yup from 'yup';

export const offboardingValidationSchema = yup.object().shape({
  exit_interview: yup.string(),
  final_settlement: yup.number().integer(),
  employee_id: yup.string().nullable(),
});
