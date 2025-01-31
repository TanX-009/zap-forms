import { TUser } from "@/types/user";
import { delete_, get, patch, post, TApiResponse } from "../serviceConfig";
import Services from "../serviceUrls";

interface TRegisterRequest {
  email: string;
  username: string;
  role: string;
  password: string;
}

interface TUpdateRequest {
  id: number;
  email: string;
  username: string;
  role: string;
}

async function getUsers(): Promise<TApiResponse<TUser[]>> {
  return get(Services.users);
}

async function registerUser(
  data: TRegisterRequest,
): Promise<TApiResponse<null>> {
  return post(Services.register, data);
}

async function updateUser(data: TUpdateRequest): Promise<TApiResponse<null>> {
  return patch(`${Services.update}${data.id}/`, data);
}

async function deleteUser(id: number): Promise<TApiResponse<null>> {
  return delete_(`${Services.delete}${id}/`);
}

const ManagementService = {
  getUsers: getUsers,
  registerUser: registerUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
};

export default ManagementService;
