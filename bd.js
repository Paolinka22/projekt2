import Database from "better-sqlite3";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";

const db_path = "./db.sqlite";
const db = new Database(db_path);

console.log("Creating database tables");
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
) STRICT;
`);
db.exec(
  `CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL,
    user_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
  ) STRICT;`
);
db.exec(
  `CREATE TABLE IF NOT EXISTS fc_session (
    id              TEXT PRIMARY KEY,
    user_id         INTEGER,
    created_at      INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
  ) STRICT;`
);
export const db_ops = {
  insert_message: db.prepare(
    `INSERT INTO messages (message, user_id)
        VALUES (?, ?) RETURNING id, message, user_id;`
  ),
    get_messages: db.prepare(
      `SELECT * FROM messages ORDER BY id DESC;`
  ),
    update_messages: db.prepare(
      `UPDATE messages SET message = ? WHERE id = ?;`
  ),
    delete_messages: db.prepare(
      `DELETE FROM messages WHERE id = ?;`
  ),
    create_user: db.prepare(
      `INSERT INTO users (username, password, role)
      VALUES (?, ?, ?);`
  ),
    get_user: db.prepare(
      `SELECT id, username, password, role FROM users WHERE username = ?;`
  ),
    create_session: db.prepare(
    `INSERT INTO fc_session (id, user_id, created_at) VALUES (?, ?, ?);`
  ),
  get_session: db.prepare(
    "SELECT id, user_id, created_at from fc_session WHERE id = ?;"
  ),
  get_user_id: db.prepare(
  `SELECT id, username, password, role FROM users WHERE id = ?;`
)
};

const countUsers = db.prepare("SELECT COUNT(*) as counter FROM users").get().counter;
console.log("Users count:", countUsers);
if(countUsers === 0){

  const insert = db.transaction(() => {
      db_ops.create_user.run("admin", bcrypt.hashSync("admin123", 10), "admin");
      db_ops.create_user.run("user1", bcrypt.hashSync("user123", 10), "user");
      db_ops.create_user.run("user2", bcrypt.hashSync("user456", 10), "user");
    });
    insert();
}

console.log("POPULATE_DB =", process.env.POPULATE_DB);
if (process.env.POPULATE_DB === "1") {
  const count = db.prepare("SELECT COUNT(*) AS licz FROM messages").get().licz;
    console.log("Messages count:", count);
  if (count === 0) {
    console.log("Populating...");
    const seed = db.prepare("INSERT INTO messages (message, user_id) VALUES (?, 2);");

    const testowe = [
      "Test 1",
      "Test 2",
      "Test 3",
      "Test 4",
      "Test 5"
    ];

    const insertMany = db.transaction(() => {
      testowe.forEach(m => seed.run(m));
    });
    insertMany();
  }
 }
 
export function createSession(userId) {
  const sessionId = randomBytes(16).toString("hex");
  const createdAt = Date.now();
  db_ops.create_session.run(sessionId, userId, createdAt);
  return { id: sessionId, user_id: userId, created_at: createdAt };
}

export function getSession(sessionId) {
  if (!sessionId) return null;
  return db_ops.get_session.get(sessionId);
}

 export default db;