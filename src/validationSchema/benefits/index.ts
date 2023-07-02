import * as yup from 'yup';

export const benefitsValidationSchema = yup.object().shape({
  benefit_details: yup.string(),
  employee_id: yup.string().nullable(),
});
