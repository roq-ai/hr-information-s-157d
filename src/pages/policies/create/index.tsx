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
import { createPolicy } from 'apiSdk/policies';
import { Error } from 'components/error';
import { policyValidationSchema } from 'validationSchema/policies';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { CompanyInterface } from 'interfaces/company';
import { getCompanies } from 'apiSdk/companies';
import { PolicyInterface } from 'interfaces/policy';

function PolicyCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PolicyInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPolicy(values);
      resetForm();
      router.push('/policies');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PolicyInterface>({
    initialValues: {
      policy_details: '',
      handbook: '',
      workflow: '',
      company_id: (router.query.company_id as string) ?? null,
    },
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
            Create Policy
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
    operation: AccessOperationEnum.CREATE,
  }),
)(PolicyCreatePage);
