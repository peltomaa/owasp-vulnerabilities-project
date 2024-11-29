import sqlite3 from "sqlite3";

export const db = new sqlite3.Database(":memory:");

db.run(
  `CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)`,
  (err) => {
    if (err) {
      console.error("Error creating table:", err.message);
    } else {
      console.log("Database and table initialized.");

      db.run(
        `INSERT INTO users (username, password) VALUES (?, ?), (?, ?)`,
        ["admin", "admin123", "user", "user123"],
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
