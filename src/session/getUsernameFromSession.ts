import { Request } from "express";

export const getUsernameFromSession = (req: Request): string | undefined => {
  console.log(req.cookies);
  const sessionCookie = req.cookies?.session;

  if (!sessionCookie) {
    return;
  }

  const [username] = sessionCookie.split("-");
  return username;
};
