import * as yup from 'yup';

export const policyValidationSchema = yup.object().shape({
  policy_details: yup.string(),
  handbook: yup.string(),
  workflow: yup.string(),
  company_id: yup.string().nullable(),
});
