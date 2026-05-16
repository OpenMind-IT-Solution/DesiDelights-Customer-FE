import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';
import { User } from '../../types/api';

export const customerService = {
  getProfile: async () => {
    const response = await apiClient.get<any>(ENDPOINTS.CUSTOMER.GET_PROFILE);
    return response.data.data;
  },
  updateProfile: async (data: Partial<User>) => {
    const response = await apiClient.post<any>(ENDPOINTS.CUSTOMER.UPDATE_PROFILE, data);
    return response.data.data;
  },
};
