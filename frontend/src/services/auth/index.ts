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
  return post(Services.login, data);
}

async function logout(): Promise<TApiResponse<TMessageResponse>> {
  return post(Services.logout, {});
}

async function refresh(): Promise<TApiResponse<TMessageResponse>> {
  return post(Services.refresh, {});
}

const AuthService = {
  login: login,
  logout: logout,
  refresh: refresh,
};

export default AuthService;

export type { TLoginResponse };
