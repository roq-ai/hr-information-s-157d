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
import { getRecruitmentById, updateRecruitmentById } from 'apiSdk/recruitments';
import { Error } from 'components/error';
import { recruitmentValidationSchema } from 'validationSchema/recruitments';
import { RecruitmentInterface } from 'interfaces/recruitment';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { CompanyInterface } from 'interfaces/company';
import { getCompanies } from 'apiSdk/companies';

function RecruitmentEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<RecruitmentInterface>(
    () => (id ? `/recruitments/${id}` : null),
    () => getRecruitmentById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: RecruitmentInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateRecruitmentById(id, values);
      mutate(updated);
      resetForm();
      router.push('/recruitments');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<RecruitmentInterface>({
    initialValues: data,
    validationSchema: recruitmentValidationSchema,
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
            Edit Recruitment
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
            <FormControl id="job_post" mb="4" isInvalid={!!formik.errors?.job_post}>
              <FormLabel>Job Post</FormLabel>
              <Input type="text" name="job_post" value={formik.values?.job_post} onChange={formik.handleChange} />
              {formik.errors.job_post && <FormErrorMessage>{formik.errors?.job_post}</FormErrorMessage>}
            </FormControl>
            <FormControl id="applications" mb="4" isInvalid={!!formik.errors?.applications}>
              <FormLabel>Applications</FormLabel>
              <Input
                type="text"
                name="applications"
                value={formik.values?.applications}
                onChange={formik.handleChange}
              />
              {formik.errors.applications && <FormErrorMessage>{formik.errors?.applications}</FormErrorMessage>}
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
    entity: 'recruitment',
    operation: AccessOperationEnum.UPDATE,
  }),
)(RecruitmentEditPage);
