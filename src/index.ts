import express from "express";
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";
import cookieParser from "cookie-parser";
import fetch from "node-fetch";
import { createSessionForUsername } from "./session/createSessionForUsername";
import { getUsernameFromSession } from "./session/getUsernameFromSession";
import { User } from "./types/User";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

const db = new sqlite3.Database(":memory:");

db.run(
  `CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)`,
  (err) => {
    if (err) {
      console.error("Error creating table:", err.message);
    } else {
      console.log("Database and table initialized.");

      db.run(
        `INSERT INTO users (username, password) VALUES ('admin', 'admin123'), ('user', 'user123')`,
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

app.get("/login", (req, res) => {
  const error = req.query.error;
  res.render("login", {
    error,
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  db.get<User>(query, (err, row) => {
    if (err) {
      res.redirect(
        `/login?error=${encodeURIComponent("Unknown error. Try login again.")}`,
      );
    } else if (row) {
      createSessionForUsername(res, row.username);
      res.redirect("/home");
    } else {
      res.redirect(
        `/login?error=${encodeURIComponent("Invalid credentials. Try login again.")}`,
      );
    }
  });
});

app.get("/home", (req, res) => {
  const session = getUsernameFromSession(req);

  if (!session) {
    res.redirect(
      `/login?error=${encodeURIComponent("Session expired. Try login again.")}`,
    );
    return;
  }

  const query = `SELECT * FROM users WHERE username = '${session}'`;

  db.get<User>(query, (_err, row) => {
    if (row) {
      res.render("home", {
        user: row,
      });
    } else {
      res.redirect(
        `/login?error=${encodeURIComponent("Unkown error. Try login again.")}`,
      );
    }
  });
});

app.get("/admin", (req, res) => {
  const session = getUsernameFromSession(req);

  if (!session) {
    res.redirect(
      `/login?error=${encodeURIComponent("Session expired. Try login again.")}`,
    );
    return;
  }

  const query = `SELECT * FROM users`;

  db.all<User>(query, (err, rows) => {
    res.render("admin", { users: rows });
  });
});

app.post("/admin/users", (req, res) => {
  const session = getUsernameFromSession(req);

  if (!session) {
    res.redirect(
      `/login?error=${encodeURIComponent("Session expired. Try login again.")}`,
    );
    return;
  }

  const username = req.body.username;
  const query = `DELETE FROM users WHERE username = '${username}'`;

  db.run(query, (err) => {
    if (err) {
      res.redirect(
        `/admin?error=${encodeURIComponent("Unable to remove user. Try again.")}`,
      );
    } else {
      res.redirect("/admin");
    }
  });
});

app.get("/debug", (_req, res) => {
  res.json({
    environment: process.env.NODE_ENV || "development",
    database: "SQLite",
    debug: true,
    activeRoutes: app._router.stack
      .filter((r: any) => r.route)
      .map(
        (r: any) =>
          `${r.route.stack.map((s: any) => s.method.toUpperCase()).join(", ")} ${r.route.path}`,
      ),
  });
});

app.get("/api/image", async (req, res) => {
  const imgUrl = req.query.url;

  try {
    const response = await fetch(imgUrl as string);
    const contentType = response.headers.get("content-type");
    const buffer = await response.buffer();

    if (contentType) {
      res.set("Content-Type", contentType);
    }
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch the image.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
