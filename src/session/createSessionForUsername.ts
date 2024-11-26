import { Response } from "express";

export const createSessionForUsername = (res: Response, username: string) => {
  const sessionToken = [username, Date.now()].join("-");
  res.cookie("session", sessionToken);
};
