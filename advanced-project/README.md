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
