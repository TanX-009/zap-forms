import { TUser } from "@/types/user";
import { TApiResponse, post, put } from "../serviceConfig";
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

async function refresh(): Promise<TApiResponse<TMessageResponse>> {
  return post(Services.refresh, {}, true);
}

const AuthService = {
  login: login,
  logout: logout,
  refresh: refresh,
};

export default AuthService;

export type { TLoginResponse };
