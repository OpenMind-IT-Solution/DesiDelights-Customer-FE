import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';

export const authService = {
  login: async (credentials: any) => {
    const response = await apiClient.post<any>(ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data.data;
  },
  guestLogin: async (phone: string) => {
    const response = await apiClient.post<any>(ENDPOINTS.AUTH.GUEST_LOGIN, { phoneNumber: phone });
    return response.data.data;
  },
  signup: async (userData: any) => {
    const response = await apiClient.post<any>(ENDPOINTS.AUTH.SIGNUP, userData);
    return response.data.data;
  },
};
