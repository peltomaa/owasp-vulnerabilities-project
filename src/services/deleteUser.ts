import { db } from "../db/client";

export const deleteUser = async (username: string) => {
  const query = `DELETE FROM users WHERE username = (?)`;

  return new Promise<void>((resolve, reject) => {
    db.run(query, [username], (err) => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
};
