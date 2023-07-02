import * as yup from 'yup';

export const onboardingValidationSchema = yup.object().shape({
  paperwork: yup.string(),
  induction: yup.string(),
  employee_id: yup.string().nullable(),
});
