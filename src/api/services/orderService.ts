import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';

export const orderService = {
  placeOrder: async (data: {
    restaurantId: number | number[];
    orderType: 'pickup' | 'delivery';
    deliveryAddress?: string;
    deliveryTime?: string;
    couponCode?: string;
    items: { menuItemId: number; quantity: number }[];
  }) => {
    const response = await apiClient.post<any>(ENDPOINTS.ORDER.PLACE, data);
    return response.data.data;
  },
  listOrders: async (params?: { page?: number; limit?: number; search?: string; status?: string[] }) => {
    const response = await apiClient.post<any>(ENDPOINTS.ORDER.LIST, params || {});
    return response.data.data;
  },
  getOrderById: async (orderId: number) => {
    const response = await apiClient.get<any>(ENDPOINTS.ORDER.GET_BY_ID(orderId));
    return response.data.data;
  },
  cancelOrder: async (orderId: number) => {
    await apiClient.patch(ENDPOINTS.ORDER.CANCEL(orderId));
  },
};
