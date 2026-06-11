import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';

export const paymentService = {
  getConfig: async (restaurantId: number = 1): Promise<{
    enabled: boolean;
    provider: string;
    publishableKey: string | null;
    currency: string;
  }> => {
    const response = await apiClient.get(ENDPOINTS.PAYMENT.CONFIG, {
      params: { restaurantId },
    });
    return response.data.data;
  },

  createIntent: async (orderId: number): Promise<{
    clientSecret: string;
    publishableKey: string;
  }> => {
    const response = await apiClient.post(ENDPOINTS.PAYMENT.CREATE_INTENT, { orderId });
    return response.data.data;
  },
};
