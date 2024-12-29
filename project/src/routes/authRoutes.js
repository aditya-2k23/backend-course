import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

// Register a new user endpoint /auth/register route
router.post("/register", (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  // TODO encrypt the password using bcrypt
  const hashedPassword = bcrypt.hashSync(password, 8);

  // save the new user and the password to the db
  try {
    const insertUser = db.prepare(`
        INSERT INTO users (username, password)
        VALUES (?, ?)
    `);
    const result = insertUser.run(username, hashedPassword);

    // We have a user now, let's add a default todo for the users
    const defaultTodo = `Hello ${username}! Add your first todo!`;
    const insertTodo = db.prepare(`
        INSERT INTO todos (user_id, task)
        VALUES (?, ?)
    `);
    insertTodo.run(result.lastInsertRowid, defaultTodo); // ? lastInsertRowid is the most recent new id of the user we just inserted

    // Create a JWT token
    const token = jwt.sign(
      {
        id: result.lastInsertRowid,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    res.json({ token }); // send the token back to the client
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503); // 503: Service Unavailable
  }

  res.sendStatus(201); // 201: Created
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  try {
    const getUser = db.prepare(`
        SELECT * FROM users
        WHERE username = ?
    `);
    const user = getUser.get(username);

    // If we cannot find a user associated with that username, return out of the function
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    // IF the password is not valid, return an error
    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid password",
      });
    }
    console.log(user);

    // After all the checks above we have a successful authentication
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    res.json({ token });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503); // 503: Service Unavailable
  }
});

export default router;
