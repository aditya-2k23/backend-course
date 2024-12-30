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
