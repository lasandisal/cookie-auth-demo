export interface User {
  id: number;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
}

export interface ApiError {
  message: string;
}