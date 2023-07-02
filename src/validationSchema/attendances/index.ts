import * as yup from 'yup';

export const attendanceValidationSchema = yup.object().shape({
  attendance_date: yup.date().required(),
  status: yup.string().required(),
  employee_id: yup.string().nullable(),
});
