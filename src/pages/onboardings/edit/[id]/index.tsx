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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getOnboardingById, updateOnboardingById } from 'apiSdk/onboardings';
import { Error } from 'components/error';
import { onboardingValidationSchema } from 'validationSchema/onboardings';
import { OnboardingInterface } from 'interfaces/onboarding';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { EmployeeInterface } from 'interfaces/employee';
import { getEmployees } from 'apiSdk/employees';

function OnboardingEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<OnboardingInterface>(
    () => (id ? `/onboardings/${id}` : null),
    () => getOnboardingById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: OnboardingInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateOnboardingById(id, values);
      mutate(updated);
      resetForm();
      router.push('/onboardings');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<OnboardingInterface>({
    initialValues: data,
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
            Edit Onboarding
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(OnboardingEditPage);
