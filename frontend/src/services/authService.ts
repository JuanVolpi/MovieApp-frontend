// src/services/authService.ts
import axios from "axios";

const API_URL = "http://localhost:5001/api/users";
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export async function login(username: string, password: string) {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  return response.data;
}


export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export async function registerUser( username: string, password: string, email: string) {
  return axios.post(`${API_URL}/register`, {
    username,
    password,
    email,
  });
}

export async function requestPasswordReset(email: string) {
  const response = await axios.post(`${API_URL}/users/reset_password_request`, {
    email,
  });
  return response.data;
}
