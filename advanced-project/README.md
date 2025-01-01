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

Now, in the `todoRoutes.js` file, we can update the create a new todo endpoint to use Prisma to create a new todo associated with a user.

```javascript
// Create a new todo
router.post("/", async (req, res) => {
  const { task } = req.body;

  const todo = await prisma.todo.create({
    data: {
      task,
      userId: req.userId,
    },
  });

  res.json(todo);
});
```

You can compare the above code with the previous project to see the difference. [Here](../project/src/routes/todoRoutes.js) is the link to the previous project's code.

### Update a Todo (Update a todo endpoint)

Now, in the `todoRoutes.js` file, we can update the update a todo endpoint to use Prisma to update a todo associated with a user.

```javascript
// Update a todo
router.put("/:id", async (req, res) => {
  const { completed } = req.body;
  const { id } = req.params; // ? req.params is an object containing properties mapped to the named route “parameters”. For example, if you have the route /user/:name, then the “name” property is available as req.params.name. This object defaults to {}.

  const updatedTodo = await prisma.todo.update({
    where: {
      id: parseInt(id),
      userId: req.userId,
    },
    data: {
      completed: !!completed, // ? The double exclamation mark (!!) is used to convert the value of "completed" to a boolean
    },
  });

  res.json(updatedTodo);
});
```

You can compare the above code with the previous project to see the difference. [Here](../project/src/routes/todoRoutes.js) is the link to the previous project's code.

### Delete a Todo (Delete a todo endpoint)

Now, in the `todoRoutes.js` file, we can update the delete a todo endpoint to use Prisma to delete a todo associated with a user.

```javascript
// Delete a todo
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  await prisma.todo.delete({
    where: {
      id: parseInt(id),
      userId,
    },
  });

  res.send({ message: "Todo deleted!" });
});
```

You can compare the above code with the previous project to see the difference. [Here](../project/src/routes/todoRoutes.js) is the link to the previous project's code.

## Dockerize the application

Now, we can create a `Dockerfile` in the root directory of the project. This file will be used to build the Docker image for the application.

Here Image refers to a snapshot of the application that can be run in a container. **A container is a running instance of an image.**

```Dockerfile
# Docker Instruction Sheet
# Use official node.js runtime as a parent image.
# Here image refers not to a picture but to a container, basically a snapshot of that container.

FROM node:22-alpine

# Set the working directory in the container to /app.
WORKDIR /app

# Copy the package.json and package-lock.json files to the container at /app.
COPY package*.json .

# Install the dependencies.
RUN npm install

# Copy the rest of the application code to the container at /app.
COPY . .

# Expose the port the app runs on.
EXPOSE 5000

# Define the command to run the application when the container starts.
CMD ["node", "./src/server.js"]
```

Most of the code above has been explained briefly in the comments of the Docker instruction sheet.

You can learn more about the Dockerfile and the instructions used in the Dockerfile from the [Docker documentation](https://docs.docker.com/engine/reference/builder/)

### Since we are going to run the application as a container, we are not using the flags that we defined in the run script in `package.json` file.

So, we need to make sure that we are not involving any SQLite database inside of our application, as we are using PostgreSQL as our database. So, we need to update some files where we are using SQLite as out database.

#### `authRoutes.js` and `todoRoutes.js`

```javascript
import db from "../db.js"; // We don't have to delete the `db.js` file, we just need to delete the imports...
```

So, by this, we are almost ready to build our container.

#### One, last thing we need to do is to finalize the prisma setup.

### Prisma setup

We need to generate a config file for Prisma to use. We can do this by running the following command:

```bash
npx prisma generate
```

This command will generate a new file called `prisma/schema.prisma` and it will be saved on the path `node_modules/@prisma/client` This file is used to define the database schema.

### Create a configuration sheet to boot up the docker environment

Now, we can create a `docker-compose.yaml` file in the root directory of the project. This file will be used to define the services that will be used to run the application.

```yaml
version: "3"
services:
  app:
    build: .
    container_name: todo-app
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/todoapp
      - JWT_SECRET=your_jwt_secret_key
      - NODE_ENV=development
      - PORT=5000
    ports:
      - "5000:5000"
    depends_on:
      - db
    volumes:
      - .:/app

  db:
    image: postgres:13-alpine
    container_name: postgres-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: todoapp
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

This file is very important as it defines the services that will be used to run the application. The `app` service is used to run the application and the `db` service is used to run the PostgreSQL database.

You can learn more about the `docker-compose.yaml` file and the services used in the file from the [Docker documentation](https://docs.docker.com/compose/compose-file/)

### Run the application

Now, with docker desktop running on your local machine, learn more about docker desktop from the [Docker documentation](https://docs.docker.com/desktop/)

You need to install docker desktop and sign up for a docker account to use docker desktop.

Then you can run the following command to build the application:

```bash
docker compose build
```

This command will build the application and create a new Docker image for the application.
Under the hood, it will run all the commands defined in the `Dockerfile` to build the image.

After the build is successful, you can run the following command to start the application:

```bash
docker compose run app npx prisma migrate dev --name init
```

This command will run the Prisma migration to create the database schema and the tables in the database. The `--name init` flag is used to name the migration.

After the migration is successful, you can run the following command to start the application:

```bash
docker compose up
```

This command will start the application and the database. The application will be running on `http://localhost:5000`. You can open this URL in your browser to see the application running.

## Important Note

So, when I checked the working of this application and tried registering for a new user, I got an error saying:

```bash
todo-app     |   id: 1,
todo-app     |   username: 'adi@gmail.com',
todo-app     |   password: '$2a$08$AOgafwK.VNHavrVvKJnjUOkHLC5sFW781OeKEMiG9OlmdK48cIice'
todo-app     | }
todo-app     | hello@gmail.com 123123123
todo-app     | node:_http_outgoing:699
todo-app     |     throw new ERR_HTTP_HEADERS_SENT('set');
todo-app     |           ^
todo-app     |
todo-app     | Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
todo-app     |     at ServerResponse.setHeader (node:_http_outgoing:699:11)
todo-app     |     at ServerResponse.header (/app/node_modules/express/lib/response.js:794:10)
todo-app     |     at ServerResponse.contentType (/app/node_modules/express/lib/response.js:624:15)
todo-app     |     at ServerResponse.sendStatus (/app/node_modules/express/lib/response.js:373:8)
todo-app     |     at file:///app/src/routes/authRoutes.js:51:7 {
todo-app     |   code: 'ERR_HTTP_HEADERS_SENT'
todo-app     | }
todo-app     |
todo-app     | Node.js v22.12.0
```

You might also encounter this error, so to fix this error, you need to update the `authRoutes.js` file.

### Update the register endpoint in `authRoutes.js` file

```javascript
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  // TODO encrypt the password using bcrypt
  const hashedPassword = bcrypt.hashSync(password, 8);

  try {
    // Check if the username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Save the new user and the password to the db
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

    // Send the token back to the client
    res.status(201).json({ token }); // Use 201 to indicate resource creation
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503); // 503: Service Unavailable
  }
});
```

We have added a check to see if the username already exists in the database. If the username already exists, we return a 409 status code with a message saying "Username already exists". This will prevent the error from occurring.

Also, we have updated the status code to 201 to indicate that a new resource has been created.
