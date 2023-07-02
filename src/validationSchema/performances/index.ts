import * as yup from 'yup';

export const performanceValidationSchema = yup.object().shape({
  kpi: yup.number().integer(),
  appraisal: yup.number().integer(),
  assessment: yup.number().integer(),
  employee_id: yup.string().nullable(),
});
