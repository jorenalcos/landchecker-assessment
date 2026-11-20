import { api } from "../../../api/client";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  MeResponse,
} from "../types/auth";

export async function login(
  credentials: LoginCredentials,
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(
    "/auth/login",
    credentials,
  );

  return response.data;
}

export async function register(
  credentials: RegisterCredentials,
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(
    "/auth/register",
    credentials,
  );

  return response.data;
}

export async function getCurrentUser(): Promise<MeResponse> {
  const response = await api.get<MeResponse>("/auth/me");

  return response.data;
}
