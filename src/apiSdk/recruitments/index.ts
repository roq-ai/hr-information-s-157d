import axios from 'axios';
import queryString from 'query-string';
import { RecruitmentInterface, RecruitmentGetQueryInterface } from 'interfaces/recruitment';
import { GetQueryInterface } from '../../interfaces';

export const getRecruitments = async (query?: RecruitmentGetQueryInterface) => {
  const response = await axios.get(`/api/recruitments${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createRecruitment = async (recruitment: RecruitmentInterface) => {
  const response = await axios.post('/api/recruitments', recruitment);
  return response.data;
};

export const updateRecruitmentById = async (id: string, recruitment: RecruitmentInterface) => {
  const response = await axios.put(`/api/recruitments/${id}`, recruitment);
  return response.data;
};

export const getRecruitmentById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/recruitments/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteRecruitmentById = async (id: string) => {
  const response = await axios.delete(`/api/recruitments/${id}`);
  return response.data;
};
