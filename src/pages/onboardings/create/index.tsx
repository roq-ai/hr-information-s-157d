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
import { createOnboarding } from 'apiSdk/onboardings';
import { Error } from 'components/error';
import { onboardingValidationSchema } from 'validationSchema/onboardings';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { EmployeeInterface } from 'interfaces/employee';
import { getEmployees } from 'apiSdk/employees';
import { OnboardingInterface } from 'interfaces/onboarding';

function OnboardingCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: OnboardingInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createOnboarding(values);
      resetForm();
      router.push('/onboardings');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<OnboardingInterface>({
    initialValues: {
      paperwork: '',
      induction: '',
      employee_id: (router.query.employee_id as string) ?? null,
    },
    validationSchema: onboardingValidationSchema,
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
            Create Onboarding
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="paperwork" mb="4" isInvalid={!!formik.errors?.paperwork}>
            <FormLabel>Paperwork</FormLabel>
            <Input type="text" name="paperwork" value={formik.values?.paperwork} onChange={formik.handleChange} />
            {formik.errors.paperwork && <FormErrorMessage>{formik.errors?.paperwork}</FormErrorMessage>}
          </FormControl>
          <FormControl id="induction" mb="4" isInvalid={!!formik.errors?.induction}>
            <FormLabel>Induction</FormLabel>
            <Input type="text" name="induction" value={formik.values?.induction} onChange={formik.handleChange} />
            {formik.errors.induction && <FormErrorMessage>{formik.errors?.induction}</FormErrorMessage>}
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
    entity: 'onboarding',
    operation: AccessOperationEnum.CREATE,
  }),
)(OnboardingCreatePage);
