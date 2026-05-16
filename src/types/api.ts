export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  isGuest: boolean;
}

export interface Category {
  id: string;
  name: string;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  images?: string[];
  categoryId: string;
  isActive: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}
