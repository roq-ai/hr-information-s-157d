import axios from 'axios';
import queryString from 'query-string';
import { PolicyInterface, PolicyGetQueryInterface } from 'interfaces/policy';
import { GetQueryInterface } from '../../interfaces';

export const getPolicies = async (query?: PolicyGetQueryInterface) => {
  const response = await axios.get(`/api/policies${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPolicy = async (policy: PolicyInterface) => {
  const response = await axios.post('/api/policies', policy);
  return response.data;
};

export const updatePolicyById = async (id: string, policy: PolicyInterface) => {
  const response = await axios.put(`/api/policies/${id}`, policy);
  return response.data;
};

export const getPolicyById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/policies/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePolicyById = async (id: string) => {
  const response = await axios.delete(`/api/policies/${id}`);
  return response.data;
};
