import axios from 'axios';
import queryString from 'query-string';
import { BenefitsInterface, BenefitsGetQueryInterface } from 'interfaces/benefits';
import { GetQueryInterface } from '../../interfaces';

export const getBenefits = async (query?: BenefitsGetQueryInterface) => {
  const response = await axios.get(`/api/benefits${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createBenefits = async (benefits: BenefitsInterface) => {
  const response = await axios.post('/api/benefits', benefits);
  return response.data;
};

export const updateBenefitsById = async (id: string, benefits: BenefitsInterface) => {
  const response = await axios.put(`/api/benefits/${id}`, benefits);
  return response.data;
};

export const getBenefitsById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/benefits/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteBenefitsById = async (id: string) => {
  const response = await axios.delete(`/api/benefits/${id}`);
  return response.data;
};
