import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";
import prisma from "../prismaClient.js";

const router = express.Router();

// Register a new user endpoint /auth/register route
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  // TODO encrypt the password using bcrypt
  const hashedPassword = bcrypt.hashSync(password, 8);

  // save the new user and the password to the db
  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // We have a user now, let's add a default todo for the users
    const defaultTodo = `Hello ${username}! Add your first todo!`;

    await prisma.todo.create({
      data: {
        task: defaultTodo,
        userId: user.id,
      },
    });

    // Create a JWT token
    const token = jwt.sign(
      {
        id: user.id,
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

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      // ? The findUnique method is used to retrieve a single user from the database based on a unique identifier which in this case is the username
      where: {
        username: username,
      },
    });

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
