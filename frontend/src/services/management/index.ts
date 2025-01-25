import { TUser } from "@/types/user";
import { get, TApiResponse } from "../serviceConfig";
import Services from "../serviceUrls";

async function getUsers(): Promise<TApiResponse<TUser[]>> {
  return get(Services.users, {}, true);
}

const ManagementService = {
  getUsers: getUsers,
};

export default ManagementService;
