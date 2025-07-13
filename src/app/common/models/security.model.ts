export interface SignupRequest {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignupResponse {
  id: number;
  firstName: string;
  email: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  requirePasswordUpdate: boolean;
}
