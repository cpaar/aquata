import { apiRequest } from "./client.js";
import type { AuthResponse } from "./types.js";

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  login: string;
  password: string;
};

export function getMe(): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/me");
}

export function register(payload: RegisterPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/register", {
    body: JSON.stringify(payload),
    method: "POST",
  });
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/login", {
    body: JSON.stringify(payload),
    method: "POST",
  });
}

export function logout(): Promise<{ ok: true }> {
  return apiRequest<{ ok: true }>("/auth/logout", { method: "POST" });
}
