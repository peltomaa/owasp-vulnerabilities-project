import { db } from "../db/client";
import { User } from "../types/User";

export const getUserWithUsernameAndPassword = async (
  username: string,
  password: string,
) => {
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  return new Promise<User | undefined>((resolve, reject) => {
    db.get<User>(query, (err, res) => {
      if (err) {
        return reject(err);
      }

      if (!res) {
        return resolve(undefined);
      }

      return resolve(res);
    });
  });
};
