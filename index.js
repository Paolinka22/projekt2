import express from "express";
import morgan from "morgan";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import db, { db_ops, createSession, getSession } from "./bd.js";

const port = 8000;
const SESSION_COOKIE = "__host_session_id";
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(morgan("dev"));
app.use(cookieParser());

app.use((req, res, next) => {
  const sessionId = req.cookies[SESSION_COOKIE];
  if (!sessionId) {
    req.user = null;
    return next();
  }

  const session = getSession(sessionId);
  if (!session) {
    req.user = null;
  } else if (session.user_id) {
    const user = db_ops.get_user_id.get(session.user_id);
    req.user = user || null;
  } else {
    req.user = null;
  }
  next();
});

app.get("/", (req, res) => {
  const rows = db_ops.get_messages.all();
  res.render("forms/form", {
    title: "Witaj!",
    description: "Dodaj wpis pamiątkowy",
    items: rows,
    user: req.user || null
  });
});
app.get("/register", (req, res) => {
  res.render("forms/new_user", {
    title: "Rejestracja użytkownika"
  });
});
app.get("/login", (req, res) => {
  res.render("forms/login", {
    title: "Logowanie"
  });
});

app.post("/register", async (req, res) => {
  try {
    const { User_name, Password } = req.body;
    const hash = await bcrypt.hash(Password.trim(), 10);
    if (!User_name || !Password) {
      return res.send("Brak danych");
    }
    
    db_ops.create_user.run(User_name.trim(), hash, "user");
    res.redirect("/login");
     } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});
app.post("/login", async (req, res) => {
  const { User_name, Password } = req.body;
  if (!User_name || !Password) return res.send("Brak danych");

  const user = db_ops.get_user.get(User_name.trim());
  if (!user) return res.send("Zła nazwa użytkownika");

  const matchPassword = await bcrypt.compare(Password.trim(), user.password);
  if (!matchPassword) return res.send("Złe hasło");

  const session = createSession(user.id);
  res.cookie(SESSION_COOKIE, session.id, { maxAge: ONE_WEEK, httpOnly: true, secure: false });

  res.redirect("/");
});
app.get("/logout", (req, res) => {
  res.clearCookie(SESSION_COOKIE);
  res.redirect("/");
});

app.post("/", (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).send("Zaloguj się");

  const { formText } = req.body;
  if (formText && formText.trim() !== "") {
    db_ops.insert_message.run(formText.trim(), user.id);
  }
  res.redirect("/");
});

app.post("/edit", (req, res) => {
const { id, message } = req.body;
  const msg = db.prepare("SELECT * FROM messages WHERE id = ?").get(id);
  if (!msg)
    return res.send("Nie znaleziono wiadomości");
  if (req.user.role !== "admin" && msg.user_id !== req.user.id) {
    return res.status(403).send("Brak uprawnień");
  }
  if (message && message.trim()) {
    db_ops.update_messages.run(message.trim(), id);
  }
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const { id } = req.body;
  const msg = db.prepare("SELECT * FROM messages WHERE id = ?").get(id);
  if (!msg)
    return res.send("Nie znaleziono wiadomości");
  if (req.user.role !== "admin" && msg.user_id !== req.user.id) {
    return res.status(403).send("Brak uprawnień");
  }
  db_ops.delete_messages.run(id);
  res.redirect("/");
});

app.listen(port, () => { 
  console.log(`Server listening on http://localhost:${port}`);
});
/*import express from "express";
import morgan from "morgan";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import db, { db_ops, createSession, getSession } from "./bd.js";

const port = 8000;
const SESSION_COOKIE = "__host_session_id";
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log("COOKIES:", req.cookies);
  const sessionId = req.cookies[SESSION_COOKIE];
   console.log("SESSION ID:", sessionId);
  if (!sessionId) {
    req.user = null;
    return next();
  }
  const session = getSession(sessionId);
  if (!session || !session.user_id) {
    req.user = null;
    return next();
  }
  const user = db_ops.get_user_id.get(session.user_id);
  req.user = user || null;

  next();
});

app.get("/", (req, res) => {
  const rows = db_ops.get_messages.all();

  res.render("forms/form", {
    title: "Witaj!",
    description: "Dodaj wpis pamiątkowy",
    items: rows,
    user: req.user
  });
});

app.get("/register", (req, res) => {
  res.render("forms/new_user", {
    title: "Rejestracja użytkownika"
  });
});
app.post("/register", async (req, res) => {
  try {
    const { User_name, Password } = req.body;
    if (!User_name || !Password) {
      return res.send("Brak danych");
    }
    const hash = await bcrypt.hash(Password.trim(), 10);
    db_ops.create_user.run(User_name.trim(), hash, "user");
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

app.get("/login", (req, res) => {
  res.render("forms/login", {
    title: "Logowanie"
  });
});

app.post("/login", async (req, res) => {
  try {
    const { User_name, Password } = req.body;
    if (!User_name || !Password) {
      return res.send("Brak danych");
    }
    const user = db_ops.get_user.get(User_name.trim());
    if (!user) {
      return res.send("Zła nazwa użytkownika");
    }
    const match = await bcrypt.compare(Password.trim(), user.password);
    if (!match) {
      return res.send("Złe hasło");
    }
    const session = createSession(user.id);
    console.log("SESSION CREATED:", session);
    res.cookie(SESSION_COOKIE, session.id, {
      maxAge: ONE_WEEK,
      httpOnly: true,
      secure: false
    });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie(SESSION_COOKIE);
  res.redirect("/");
});

app.post("/", (req, res) => {
  if (!req.user) {
    return res.status(401).send("Zaloguj się");
  }
  try {
    const { formText } = req.body;
    if (formText && formText.trim() !== "") {
      db_ops.insert_message.run(formText.trim(), req.user.id);
    }
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

app.post("/edit", (req, res) => {
  const { id, message } = req.body;
  if (id && message.trim()) {
    db_ops.update_messages.run(message.trim(), id);
  }
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const { id } = req.body;
  if (id) {
    db_ops.delete_messages.run(id);
  }
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});*/