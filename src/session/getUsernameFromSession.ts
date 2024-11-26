import { Request } from "express";

export const getUsernameFromSession = (req: Request): string | undefined => {
  const sessionCookie = req.session.username;

  if (!sessionCookie) {
    return;
  }

  const [username] = sessionCookie.split("-");
  return username;
};
