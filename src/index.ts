import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import fetch from "node-fetch";
import { createSessionForUsername } from "./session/createSessionForUsername";
import { getUserFromSession } from "./services/getUserFromSession";
import { getUsers } from "./services/getUsers";
import { getUserWithUsernameAndPassword } from "./services/getUserWithUsernameAndPassword";
import { deleteUser } from "./services/deleteUser";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

app.get("/login", (req, res) => {
  const error = req.query.error;
  res.render("login", {
    error,
  });
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await getUserWithUsernameAndPassword(username, password);

    if (!user) {
      res.redirect(
        `/login?error=${encodeURIComponent("Invalid credentials. Try login again.")}`,
      );
      return;
    }

    createSessionForUsername(res, user.username);
    res.redirect("/home");
  } catch (e) {
    res.redirect(
      `/login?error=${encodeURIComponent("Unknown error. Try login again.")}`,
    );
  }
});

app.get("/home", async (req, res) => {
  const session = await getUserFromSession(req);

  if (!session) {
    res.redirect(
      `/login?error=${encodeURIComponent("Session expired. Try login again.")}`,
    );
    return;
  }

  console.log(session);

  res.render("home", {
    user: session,
  });
});

app.get("/admin", async (req, res) => {
  const sessionUser = await getUserFromSession(req);

  if (!sessionUser) {
    res.redirect(
      `/login?error=${encodeURIComponent("Session expired. Try login again.")}`,
    );
    return;
  }

  const users = await getUsers();

  res.render("admin", { users });
});

app.post("/admin/users", async (req, res) => {
  try {
    const sessionUser = await getUserFromSession(req);

    if (!sessionUser) {
      res.redirect(
        `/login?error=${encodeURIComponent("Session expired. Try login again.")}`,
      );
      return;
    }

    const username = req.body.username;
    await deleteUser(username);

    res.redirect("/admin");
  } catch (e) {
    res.redirect(
      `/admin?error=${encodeURIComponent("Unable to remove user. Try again.")}`,
    );
  }
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
