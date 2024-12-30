# Advanced Full Stack TODO Application

This is a full stack TODO application that allows users to create, read, update, and delete tasks. The application is built using `express`, `prisma`, `jwt`, `bcrypt`, `postgresql`, and `docker`.

## Start developing the app

First, we can create a copy of the previous project, then in the new folder, we can optionally change the name and the description of the project to something like:

> "A dockerize full stack todo application that uses a NODEJS backend, a PostgreSQL database, a Prisma ORM, and JWT Authentication."
> (Name it anything you like).

Then we can install some necessary dependencies:

```bash
npm install express prisma @prisma/client pg
```

Then, you can able to see the `package.json` updated with the new dependencies.

```json
{
  "name": "advanced-full-stack-todo-app",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "dev": "node --watch --env-file=.env --experimental-strip-types --experimental-sqlite ./src/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "Aditya",
  "license": "ISC",
  "description": "A dockerize full stack todo application that uses a NODEJS backend, a PostgreSQL database, a Prisma ORM, and JWT Authentication.",
  "dependencies": {
    "@prisma/client": "^6.1.0",
    "bcryptjs": "^2.4.3",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2",
    "pg": "^8.13.1",
    "prisma": "^6.1.0"
  }
}
```

Now, we run the following command to create a new Prisma schema file:

```bash
npx prisma init
```

By running the above command, you will see a new folder called `prisma` created in the root directory of the project. Inside the `prisma` folder, you will see a new file called `schema.prisma`. This file is used to define the database schema. No, inside of which we can define our two models (tables), `User` and `Task`.

```prisma
model User {
    id        Int      @id @default(autoincrement())
    username  String   @unique
    password  String
    todos     Todo[]
}

model Todo {
    id        Int      @id @default(autoincrement())
    task      String
    completed Boolean  @default(false)
    userId    Int
    user      User     @relation(fields: [userId], references: [id])
}
```

You must be able to see that these models are the same as the ones we defined in the previous project. The only difference is that they were created using the SQL queries but here we are using Prisma to define the models.

Your, `schema.prisma` file should look like this:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
    id        Int      @id @default(autoincrement())
    username  String   @unique
    password  String
    todos     Todo[]
}

model Todo {
    id        Int      @id @default(autoincrement())
    task      String
    completed Boolean  @default(false)
    userId    Int
    user      User     @relation(fields: [userId], references: [id])
}
```

You can learn more on the Prisma schema by the link given in the above code comments.

### Setup Prisma Client

You now have to create a `prismaClient.js` file in the `src` directory of your `advanced-project`. This file will be used to create a new instance of the Prisma Client.

```javascript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

### Create a new User (Register endpoint)

Now, in the `authRoutes.js` file, we can create a new user by updating the existing logic to use Prisma to create a new user.

```javascript
import prisma from "../prismaClient.js";

/*
 ---
 Other code ↕
 ---
*/

// Register a new user endpoint /auth/register route
router.post("/register", async (req, res) => {
  // async function to handle the requests
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
```

You can compare the above code with the previous project to see the difference. [Here](../project/src/routes/authRoutes.js) is the link to the previous project's code.
We are now using Prisma to create a new user instead of using the SQL queries.

### Login a User (Login endpoint)

Now, in the `authRoutes.js` file, we can update the login endpoint to use Prisma to find a user by username and verify the password.

```javascript
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
```

You can again compare the above code with the previous project to see the difference. [Here](../project/src/routes/authRoutes.js) is the link to the previous project's code.
We are now using Prisma to find an existing user by username instead of using the SQL queries.

### Get all Todos (Get all todos endpoint)

Now, in the `todoRoutes.js` file, we can update the get all todos endpoint to use Prisma to find all the todos associated with a user.

```javascript
import prisma from "../prismaClient.js";

/*
 ---
 Other code ↕
 ---
*/

// Get all todos for logged-in user
router.get("/", async (req, res) => {
  const todos = await prisma.todo.findMany({
    // ? The findMany method is used to retrieve all todos from the database as an array of objects
    where: {
      userId: req.userId,
    },
  });

  res.json(todos);
});
```

You can compare the above code with the previous project to see the difference. [Here](../project/src/routes/todoRoutes.js) is the link to the previous project's code.

Again, you can get all the information regarding the functions used here such as findMany or findUnique from the [Prisma documentation](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/querying-the-database-typescript-sqlserver)

### Create a new Todo (Create a new todo endpoint)
