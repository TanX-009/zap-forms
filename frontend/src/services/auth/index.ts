import { TUser } from "@/types/user";
import { TApiResponse, post } from "../serviceConfig";
import Services from "../serviceUrls";

interface TLoginRequest {
  email: string;
  password: string;
}

interface TLoginResponse {
  user: TUser;
}

interface TMessageResponse {
  message: string;
}

async function login(
  data: TLoginRequest,
): Promise<TApiResponse<TLoginResponse>> {
  return post(Services.login, data, true);
}

async function logout(): Promise<TApiResponse<TMessageResponse>> {
  return post(Services.logout, {}, true);
}

async function register<T>(
  data: Record<string, unknown>,
): Promise<TApiResponse<T>> {
  return post(Services.register, data, true);
}

async function refresh(): Promise<TApiResponse<TMessageResponse>> {
  return post(Services.refresh, {}, true);
}

const AuthService = {
  login: login,
  logout: logout,
  register: register,
  refresh: refresh,
};

export default AuthService;

export type { TLoginResponse };
