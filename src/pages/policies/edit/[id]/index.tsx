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
import { getPolicyById, updatePolicyById } from 'apiSdk/policies';
import { Error } from 'components/error';
import { policyValidationSchema } from 'validationSchema/policies';
import { PolicyInterface } from 'interfaces/policy';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { CompanyInterface } from 'interfaces/company';
import { getCompanies } from 'apiSdk/companies';

function PolicyEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PolicyInterface>(
    () => (id ? `/policies/${id}` : null),
    () => getPolicyById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PolicyInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePolicyById(id, values);
      mutate(updated);
      resetForm();
      router.push('/policies');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<PolicyInterface>({
    initialValues: data,
    validationSchema: policyValidationSchema,
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
            Edit Policy
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
            <FormControl id="policy_details" mb="4" isInvalid={!!formik.errors?.policy_details}>
              <FormLabel>Policy Details</FormLabel>
              <Input
                type="text"
                name="policy_details"
                value={formik.values?.policy_details}
                onChange={formik.handleChange}
              />
              {formik.errors.policy_details && <FormErrorMessage>{formik.errors?.policy_details}</FormErrorMessage>}
            </FormControl>
            <FormControl id="handbook" mb="4" isInvalid={!!formik.errors?.handbook}>
              <FormLabel>Handbook</FormLabel>
              <Input type="text" name="handbook" value={formik.values?.handbook} onChange={formik.handleChange} />
              {formik.errors.handbook && <FormErrorMessage>{formik.errors?.handbook}</FormErrorMessage>}
            </FormControl>
            <FormControl id="workflow" mb="4" isInvalid={!!formik.errors?.workflow}>
              <FormLabel>Workflow</FormLabel>
              <Input type="text" name="workflow" value={formik.values?.workflow} onChange={formik.handleChange} />
              {formik.errors.workflow && <FormErrorMessage>{formik.errors?.workflow}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<CompanyInterface>
              formik={formik}
              name={'company_id'}
              label={'Select Company'}
              placeholder={'Select Company'}
              fetcher={getCompanies}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
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
    entity: 'policy',
    operation: AccessOperationEnum.UPDATE,
  }),
)(PolicyEditPage);
