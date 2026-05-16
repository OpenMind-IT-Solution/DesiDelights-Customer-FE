import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';
import { Category, MenuItem } from '../../types/api';

export const websiteService = {
  getCategories: async () => {
    const response = await apiClient.post<any>(ENDPOINTS.WEBSITE.CATEGORIES_LIST);
    return response.data.data?.categories || [];
  },
  getCategoryDetails: async (id: string) => {
    const response = await apiClient.get<any>(ENDPOINTS.WEBSITE.CATEGORY_DETAILS(id));
    return response.data.data;
  },
  getMenuItems: async (filters: any = {}) => {
    const response = await apiClient.post<any>(ENDPOINTS.WEBSITE.MENU_ITEMS_LIST, filters);
    return response.data.data?.menuItems || [];
  },
  getMenuItemDetails: async (id: string) => {
    const response = await apiClient.get<any>(ENDPOINTS.WEBSITE.MENU_ITEM_DETAILS(id));
    return response.data.data;
  },
};
