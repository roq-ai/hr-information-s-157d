import * as yup from 'yup';

export const recruitmentValidationSchema = yup.object().shape({
  job_post: yup.string(),
  applications: yup.string(),
  company_id: yup.string().nullable(),
});
