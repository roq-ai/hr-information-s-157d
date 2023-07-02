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
import { getOffboardingById, updateOffboardingById } from 'apiSdk/offboardings';
import { Error } from 'components/error';
import { offboardingValidationSchema } from 'validationSchema/offboardings';
import { OffboardingInterface } from 'interfaces/offboarding';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { EmployeeInterface } from 'interfaces/employee';
import { getEmployees } from 'apiSdk/employees';

function OffboardingEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<OffboardingInterface>(
    () => (id ? `/offboardings/${id}` : null),
    () => getOffboardingById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: OffboardingInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateOffboardingById(id, values);
      mutate(updated);
      resetForm();
      router.push('/offboardings');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<OffboardingInterface>({
    initialValues: data,
    validationSchema: offboardingValidationSchema,
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
            Edit Offboarding
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
            <FormControl id="exit_interview" mb="4" isInvalid={!!formik.errors?.exit_interview}>
              <FormLabel>Exit Interview</FormLabel>
              <Input
                type="text"
                name="exit_interview"
                value={formik.values?.exit_interview}
                onChange={formik.handleChange}
              />
              {formik.errors.exit_interview && <FormErrorMessage>{formik.errors?.exit_interview}</FormErrorMessage>}
            </FormControl>
            <FormControl id="final_settlement" mb="4" isInvalid={!!formik.errors?.final_settlement}>
              <FormLabel>Final Settlement</FormLabel>
              <NumberInput
                name="final_settlement"
                value={formik.values?.final_settlement}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('final_settlement', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.final_settlement && <FormErrorMessage>{formik.errors?.final_settlement}</FormErrorMessage>}
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
    entity: 'offboarding',
    operation: AccessOperationEnum.UPDATE,
  }),
)(OffboardingEditPage);
