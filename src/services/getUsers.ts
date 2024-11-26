import { db } from "../db/client";
import { User } from "../types/User";

export const getUsers = async () => {
  const query = `SELECT * FROM users`;

  return new Promise<User[]>((resolve, reject) => {
    db.all<User>(query, (err, res) => {
      if (err) {
        return reject(err);
      }

      return resolve(res);
    });
  });
};
