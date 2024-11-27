import { User } from "../types/User";

const ADMIN_USERNAMES = ["admin"];
export const isAdmin = (user: User) => ADMIN_USERNAMES.includes(user.username);
