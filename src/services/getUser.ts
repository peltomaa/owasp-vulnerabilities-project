import { db } from "../db/client";
import { User } from "../types/User";

export const getUser = async (username: string) => {
  const query = `SELECT * FROM users WHERE username = '${username}'`;

  return new Promise<User>((resolve, reject) => {
    db.get<User>(query, (err, res) => {
      if (err) {
        return reject(err);
      }

      return resolve(res);
    });
  });
};
