import Cookies from "js-cookie";
import { TUser } from "@/types/user";

export function setLogin(user: TUser) {
  Cookies.set("login", JSON.stringify(user));
}

export function getLogin(): TUser | null {
  const userCookie = Cookies.get("login");
  if (userCookie) {
    try {
      return JSON.parse(userCookie) as TUser;
    } catch (error) {
      console.error("Error parsing user cookie:", error);
    }
  }
  return null;
}
