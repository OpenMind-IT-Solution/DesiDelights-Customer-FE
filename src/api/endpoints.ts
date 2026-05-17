export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/website/auth/login',
    GUEST_LOGIN: '/website/auth/guest-login',
    SIGNUP: '/website/auth/signup',
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
