import { db } from "../db/client";

export const deleteUser = async (username: string) => {
  const query = `DELETE FROM users WHERE username = '${username}'`;

  return new Promise<void>((resolve, reject) => {
    db.run(query, (err) => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
};
