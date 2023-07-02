import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createPerformance } from 'apiSdk/performances';
import { Error } from 'components/error';
import { performanceValidationSchema } from 'validationSchema/performances';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { EmployeeInterface } from 'interfaces/employee';
import { getEmployees } from 'apiSdk/employees';
import { PerformanceInterface } from 'interfaces/performance';

function PerformanceCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PerformanceInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPerformance(values);
      resetForm();
      router.push('/performances');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PerformanceInterface>({
    initialValues: {
      kpi: 0,
      appraisal: 0,
      assessment: 0,
      employee_id: (router.query.employee_id as string) ?? null,
    },
    validationSchema: performanceValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Performance
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="kpi" mb="4" isInvalid={!!formik.errors?.kpi}>
            <FormLabel>Kpi</FormLabel>
            <NumberInput
              name="kpi"
              value={formik.values?.kpi}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('kpi', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.kpi && <FormErrorMessage>{formik.errors?.kpi}</FormErrorMessage>}
          </FormControl>
          <FormControl id="appraisal" mb="4" isInvalid={!!formik.errors?.appraisal}>
            <FormLabel>Appraisal</FormLabel>
            <NumberInput
              name="appraisal"
              value={formik.values?.appraisal}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('appraisal', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.appraisal && <FormErrorMessage>{formik.errors?.appraisal}</FormErrorMessage>}
          </FormControl>
          <FormControl id="assessment" mb="4" isInvalid={!!formik.errors?.assessment}>
            <FormLabel>Assessment</FormLabel>
            <NumberInput
              name="assessment"
              value={formik.values?.assessment}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('assessment', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.assessment && <FormErrorMessage>{formik.errors?.assessment}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<EmployeeInterface>
            formik={formik}
            name={'employee_id'}
            label={'Select Employee'}
            placeholder={'Select Employee'}
            fetcher={getEmployees}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.personal_details}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'performance',
    operation: AccessOperationEnum.CREATE,
  }),
)(PerformanceCreatePage);
