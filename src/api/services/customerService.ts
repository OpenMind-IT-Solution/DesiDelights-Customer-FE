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
  getAddresses: async () => {
    const response = await apiClient.get<any>(ENDPOINTS.ADDRESS.GET_ALL);
    return response.data.data.addresses;
  },
  saveAddress: async (data: { id?: string; lat: number; lng: number; label: string; address: string }) => {
    const response = await apiClient.post<any>(ENDPOINTS.ADDRESS.SAVE, data);
    return response.data.data;
  },
  deleteAddress: async (id: string) => {
    const response = await apiClient.delete<any>(ENDPOINTS.ADDRESS.DELETE(id));
    return response.data.data;
  },
};
