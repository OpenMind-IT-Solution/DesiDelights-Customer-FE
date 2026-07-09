export interface ApiResponse<T> {
  status: "success" | "failure";
  message: string;
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
  priceWithVat?: number;
  images?: string[];
  categoryId: string;
  isActive: boolean;
  tag?: string;
  offer?: string;
  vatRate?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface SignupPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  restaurantId?: number | number[];
}

export interface PasswordResetPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

export type MessageResponse = ApiResponse<unknown>;
