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
import { getBenefitsById, updateBenefitsById } from 'apiSdk/benefits';
import { Error } from 'components/error';
import { benefitsValidationSchema } from 'validationSchema/benefits';
import { BenefitsInterface } from 'interfaces/benefits';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { EmployeeInterface } from 'interfaces/employee';
import { getEmployees } from 'apiSdk/employees';

function BenefitsEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<BenefitsInterface>(
    () => (id ? `/benefits/${id}` : null),
    () => getBenefitsById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: BenefitsInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateBenefitsById(id, values);
      mutate(updated);
      resetForm();
      router.push('/benefits');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<BenefitsInterface>({
    initialValues: data,
    validationSchema: benefitsValidationSchema,
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
            Edit Benefits
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
            <FormControl id="benefit_details" mb="4" isInvalid={!!formik.errors?.benefit_details}>
              <FormLabel>Benefit Details</FormLabel>
              <Input
                type="text"
                name="benefit_details"
                value={formik.values?.benefit_details}
                onChange={formik.handleChange}
              />
              {formik.errors.benefit_details && <FormErrorMessage>{formik.errors?.benefit_details}</FormErrorMessage>}
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
    entity: 'benefits',
    operation: AccessOperationEnum.UPDATE,
  }),
)(BenefitsEditPage);
