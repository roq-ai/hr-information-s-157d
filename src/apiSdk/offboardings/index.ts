import axios from 'axios';
import queryString from 'query-string';
import { OffboardingInterface, OffboardingGetQueryInterface } from 'interfaces/offboarding';
import { GetQueryInterface } from '../../interfaces';

export const getOffboardings = async (query?: OffboardingGetQueryInterface) => {
  const response = await axios.get(`/api/offboardings${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createOffboarding = async (offboarding: OffboardingInterface) => {
  const response = await axios.post('/api/offboardings', offboarding);
  return response.data;
};

export const updateOffboardingById = async (id: string, offboarding: OffboardingInterface) => {
  const response = await axios.put(`/api/offboardings/${id}`, offboarding);
  return response.data;
};

export const getOffboardingById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/offboardings/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteOffboardingById = async (id: string) => {
  const response = await axios.delete(`/api/offboardings/${id}`);
  return response.data;
};
