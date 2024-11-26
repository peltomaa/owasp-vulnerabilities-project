import { Request } from "express";
import { User } from "../types/User";
import { getUsernameFromSession } from "../session/getUsernameFromSession";
import { getUser } from "./getUser";

export const getUserFromSession = async (
  req: Request,
): Promise<User | undefined> => {
  const username = getUsernameFromSession(req);

  if (!username) {
    return;
  }

  return await getUser(username);
};
