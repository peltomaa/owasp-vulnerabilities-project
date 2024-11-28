import express from "express";
import session from "express-session";

declare module "express-session" {
  interface SessionData {
    username: string;
  }
}
