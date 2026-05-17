import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';

export const cartService = {
  getCart: async () => {
    const response = await apiClient.get<any>(ENDPOINTS.CART.GET);
    return response.data.data;
  },
  syncCart: async (items: any[]) => {
    const response = await apiClient.post<any>(ENDPOINTS.CART.SYNC, { items });
    return response.data.data;
  },
};
