import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';
import type {
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  MessageResponse,
  PasswordResetPayload,
  SignupPayload,
} from '../../types/api';

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data.data;
  },
  guestLogin: async (phone: string) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.AUTH.GUEST_LOGIN, { phoneNumber: phone });
    return response.data.data;
  },
  signup: async (userData: SignupPayload) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.AUTH.SIGNUP, userData);
    return response.data.data;
  },
  forgotPassword: async (email: string) => {
    const response = await apiClient.post<MessageResponse>(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  },
  validateResetToken: async (token: string) => {
    const response = await apiClient.get<MessageResponse>(ENDPOINTS.AUTH.VALIDATE_RESET_TOKEN, {
      params: { token },
    });
    return response.data;
  },
  resetPassword: async (data: PasswordResetPayload) => {
    const response = await apiClient.post<MessageResponse>(ENDPOINTS.AUTH.RESET_PASSWORD, data);
    return response.data;
  },
};
