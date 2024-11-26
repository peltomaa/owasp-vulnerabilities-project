import { Request } from "express";

export const createSessionForUsername = (req: Request, username: string) => {
  req.session.username = username;
};
