import { db } from "../db/client";
import { User } from "../types/User";
import { comparePasswords } from "../utils/comparePasswords";

export const getUserWithUsernameAndPassword = async (
  username: string,
  password: string,
) => {
  const query = `SELECT * FROM users WHERE username = '${username}'`;

  return new Promise<User | undefined>((resolve, reject) => {
    db.get<User>(query, async (err, res) => {
      if (err) {
        return reject(err);
      }

      if (!res) {
        return resolve(undefined);
      }

      console.log(password, res);
      const isMatch = await comparePasswords(password, res.password);

      if (!isMatch) {
        return resolve(undefined);
      }

      return resolve(res);
    });
  });
};
