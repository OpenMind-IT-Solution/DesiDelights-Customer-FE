export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/website/auth/login',
    GUEST_LOGIN: '/website/auth/guest-login',
    SIGNUP: '/website/auth/signup',
    FORGOT_PASSWORD: '/website/auth/forgot-password',
    VALIDATE_RESET_TOKEN: '/website/auth/reset-password/validate',
    RESET_PASSWORD: '/website/auth/reset-password',
  },
  CUSTOMER: {
    GET_PROFILE: '/customers/profile',
    UPDATE_PROFILE: '/customers/update-profile',
  },
  CART: {
    GET: '/website/cart',
    SYNC: '/website/cart/sync',
  },
  WEBSITE: {
    CATEGORIES_LIST: '/website/categories/list',
    CATEGORY_DETAILS: (id: string) => `/website/categories/${id}`,
    MENU_ITEMS_LIST: '/website/menu-items/list',
    MENU_ITEM_DETAILS: (id: string) => `/website/menu-items/${id}`,
    RESTAURANT_BANNERS: (restaurantId: number | string) => `/website/restaurants/${restaurantId}/banners`,
  },
  ADDRESS: {
    GET_ALL: '/website/addresses',
    SAVE: '/website/addresses/save',
    DELETE: (id: string) => `/website/addresses/${id}`,
  },
  COUPON: {
    LIST: '/website/coupons',
    VALIDATE: '/website/coupons/validate',
  },
  ORDER: {
    PLACE: '/orders/place',
    LIST: '/orders/list',
  },
};
