import bcrypt from "bcrypt";

export const comparePasswords = async (a: string, b: string) =>
  await bcrypt.compare(a, b);
