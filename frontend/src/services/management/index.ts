import { TUser } from "@/types/user";
import { get, put, TApiResponse } from "../serviceConfig";
import Services from "../serviceUrls";

interface TRegisterRequest {
  email: string;
  username: string;
  role: string;
  password: string;
}

async function getUsers(): Promise<TApiResponse<TUser[]>> {
  return get(Services.users, {}, true);
}

async function registerUser(
  data: TRegisterRequest,
): Promise<TApiResponse<TRegisterRequest>> {
  return put(Services.register, data, true);
}

const ManagementService = {
  getUsers: getUsers,
  registerUser: registerUser,
};

export default ManagementService;
