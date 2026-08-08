export interface AuthUser {
  id: string;
  email: string;
  username: string | null;
  title: string | null;
  avatar: string | null;
  profileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthUser;
  accessToken: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: AuthUser;
}
