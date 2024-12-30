import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync(":memory:"); // Store the created database in the memory of the computer.

// TODO Executing SQL statements to create tables in the database.
db.exec(`
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
`);

db.exec(`
    CREATE TABLE todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        task TEXT,
        completed BOOLEAN DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
`);

export default db; // Exporting the database object so that we can use it in other files.
