import sqlite3 from "sqlite3";
import { User } from "../types/User";
import { hashPassword } from "../utils/hashPassword";

export const db = new sqlite3.Database(":memory:");

const [adminUser, userUser] = [
  {
    username: "admin",
    password: "admin123",
  },
  {
    username: "user",
    password: "user123",
  },
] as const satisfies User[];

db.run(
  `CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)`,
  async (err) => {
    if (err) {
      console.error("Error creating table:", err.message);
    } else {
      console.log("Database and table initialized.");

      db.run(
        `INSERT INTO users (username, password) VALUES (?, ?), (?, ?)`,
        [
          adminUser.username,
          await hashPassword(adminUser.password),
          userUser.username,
          await hashPassword(userUser.password),
        ],
        (insertErr) => {
          if (insertErr) {
            console.error("Error inserting default users:", insertErr.message);
          } else {
            console.log("Default users added: admin/admin123, user/user123");
          }
        },
      );
    }
  },
);
