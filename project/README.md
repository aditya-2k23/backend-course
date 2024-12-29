# Full Stack TODO Application

This is a full stack todo application that allows users to create, read, update, and delete todos.

In this README, every step will be explained in detail so that you can follow along and create your own full stack todo application.

## Setting up the project's backend server

### 1. Create `package.json` file in your project's root directory

```bash
npm init -y
```

With that above command, you will have a `package.json` file in your project's root directory, with the code:

```json
{
  "name": "full-stack-todo-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

### 2. Create the basic folder structure

Create the following folders in your project's root directory:

- `public`
- `src`
  - `middleware`
    - `authMiddleware.js`
  - `routes`
    - `authRoutes.js`
    - `todoRoutes.js`
  - `db.js`
  - `server.js`
- `.env`
- `todo-app.rest` # (optional) for testing the API endpoints

### 3. Install the required dependencies

```bash
npm install express bcryptjs jsonwebtoken
```

- _**express**_: To create the server
- _**bcryptjs**_: To encrypt the user's password
- _**jsonwebtoken**_: To create and verify the tokens

### 4. Add the scripts to `package.json`

```json
"scripts": {
    "dev": "node --watch --env-file=.env --experimental-strip-types --experimental-sqlite ./src/server.js",
}
```

These flags provide the following functionalities:

- `--watch`: Restarts the server whenever a file changes
- `--env-file`: Loads the environment variables from the `.env` file
- `--experimental-strip-types`: Removes the types from the JavaScript files
- `--experimental-sqlite`: Allows the use of SQLite

- Note: You must have noticed that we didn't installed the `nodemon` package. That's because we are using the `--watch` flag to restart the server whenever a file changes. This flag is available in Node.js v15.0.0 and later.

- **\*Optional** You can also add a description to your project by changing the `description` field in the `package.json` file to something like:

```json
"description": "Full Stack TODO Application that uses a NODEJS backend, a SQLite database and JWT Authentication.",
```

#### `package.json` file after adding the scripts:

```json
{
  "name": "full-stack-todo-app",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "dev": "node --watch --env-file=.env --experimental-strip-types --experimental-sqlite ./src/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "Full Stack TODO Application that uses a NODEJS backend, a SQLite database and JWT Authentication.",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2"
  }
}
```

#### We can start the server by running the following command:

```bash
npm run dev
```

This will start the backend server.

### 5. server.js file

In your `server.js` file, add the following code:

```javascript
import express from "express";

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

This code creates an express server and listens on the port specified in the environment variable `PORT` (if exists) else on port `5000` by default.

- **Note**: You must have noticed that we are using ES Modules in this project. To use ES Modules, you need to add `"type": "module"` to your `package.json` file.

#### Add the type field to the `package.json` file:

```json
"type": "module",
```

We could have also used CommonJS modules by changing the import statement to:

```javascript
const express = require("express");
```

then we would not need to add `"type": "module"` to the `package.json` file. (But the ES Modules are more modern, recommended, and my personal preference 😉).

#### So, by following all the previous steps, you have successfully set up the backend of your full stack todo application.

> Now, you can run the `npm run dev` command to start the server and test if it is working correctly.
> The server would be running on `http://localhost:${PORT}`, where `PORT` is the port number you specified in the `.env` file or `5000` by default.

- **Note**: We have used Node version 22.12.0 using the node version manager (`nvm`) to run the project. To use this, you can run the following command:

```bash
nvm use 22.12.0
```

- ⭐**Note**: If you already have Node version 22.12.0 or higher installed on your machine, you can skip to setting up the frontend of our website.⭐

If nvm is not installed on your machine, you can install it by following the instructions on the [nvm GitHub repository](https://github.com/nvm-sh/nvm)

Or use the following command to install nvm:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

- **Note**: If there is an error in the terminal like:

```bash
Invoke-WebRequest : A parameter cannot be found that matches parameter name 'o-'.
At line:1 char:6
+ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install ...
+      ~~~
    + CategoryInfo          : InvalidArgument: (:) [Invoke-WebRequest], ParameterBindingException
    + FullyQualifiedErrorId : NamedParameterNotFound,Microsoft.PowerShell.Commands.InvokeWebRequestCommand
```

You can change your terminal to use WSL (Windows Subsystem for Linux) or use Git Bash to run the command.

After installation of nvm and execution of use command of nvm updating the node version to 22.16.0, you can reopen the terminal and start using that version of Node.

If that doesn't work for you then you can run the following command to use it immediately, within the same instance:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
```

Then in the same terminal, run the following command:

```bash
npm run dev
```

This will start the server and you will see the message `Server is running on port 5000` in the terminal. (Not in the default powershell terminal of windows)

---

## Setting up the frontend

### 1. Create the files in public folder

Create the following files in the `public` folder:

- `index.html`
- `style.css`
- `fanta.css`

- **Note**: In this project, I will not tell you how to write the HTML and CSS code. You can write your _own code_ or _copy_ the code from the project's repository as this is not the main focus of our backend project.

### 2. Link the frontend to the backend

In the `server.js` file, add the following code:

```javascript
import path, { dirname } from "path";
import { fileURLToPath } from "url";

/*
 ---
 Other code ↕
 ---
*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// * Middleware
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

// * Update the app.get() endpoint to send the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

A lot of happened in the few lines of code above:

- We imported the `path` module to work with file paths.
- We imported the `fileURLToPath` and `dirname` functions from the `url` module to get the directory name of the current module.
- We created the `__filename` and `__dirname` variables to get the filename and directory name of the current module.
- We added the `express.json()` middleware to parse the incoming request with JSON payloads.
- We added the `express.static()` middleware to serve the static files from the `public` folder.
- We updated the `app.get()` endpoint to send the `index.html` file when the user visits the root URL.

* **Note**: The `express.static()` middleware is used to serve the static files such as images, CSS files, and JavaScript files from the `public` folder. Specifically, in our case it is just to serve any requests for the css files resolved from the public folder.

#### By following the above steps, you have successfully linked the frontend to the backend. 🥳

## Setting up the database

Create a `db.js` file in the `src` folder and add the following code, we are using SQLite as our database:

```javascript
import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync(":memory:");

// Executing SQL statements to create tables in the database.
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
```

The db variable is an instance of the `DatabaseSync` class from the `node:sqlite` module. It creates a new SQLite database in memory of the computer.

This code creates a new SQLite database in memory and creates two tables: `users` and `todos`.

- The `users` table has three columns: `id`, `username`, and `password`.
- The `todos` table has four columns: `id`, `user_id`, `task`, and `completed` (with a default value of `0` \*false).

The SQL queries used above are to create the tables and their columns.
For the first column of both the tables we have used `AUTOINCREMENT` to automatically increment the value of the column whenever a new row is inserted and id will act as the primary key which is used to uniquely identify each row in the table.

In the last column of the todos table we have defined the FOREIGN KEY constraint which is used to link the `user_id` column of the todos table to the `id` column of the users table.

- **NOTE**: You can further explore the SQLite documentation to understand more about the SQL queries used above. [SQLite Documentation](https://www.sqlite.org/docs.html)

## Create the Routes

So, with our database set up try going to the [localhost](https://localhost:5000) and try sign up for a new user. You will able to see that there is an error stating that the `authRoutes` and `todoRoutes` are not available.

So, let's create the required routes for the application.

### 1. Create the `authRoutes.js` file

In the `src/routes` folder, create a new file called `authRoutes.js` and add the following code:

```javascript
import express from "express";

const router = express.Router(); // Creating a router to navigate to different routes using express.

router.post("/register", (req, res) => {}); // Route to register a new user and create a new account

router.post("/login", (req, res) => {}); // Route to login an existing user and create a new session for existing user

export default router;
```

This code creates a new router using the `express.Router()` method and defines two routes: `/register` and `/login`.

### 2. Create the `todoRoutes.js` file

In the `src/routes` folder, create a new file called `todoRoutes.js` and add the following code:

```javascript
import express from "express";

const router = express.Router(); // Creating a router to navigate to different routes using express.

// Get all todos for logged-in user
router.get("/", (req, res) => {});

// Create a new todo
router.post("/", (req, res) => {});

// Update a todo
router.put("/:id", (req, res) => {});

// Delete a todo
router.delete("/:id", (req, res) => {});

export default router;
```

You can see all the CRUD operations are defined in the `todoRoutes.js` file. We will implement these operations in the next steps.

You can see we have used the `:id` parameter in the `PUT` and `DELETE` routes. This parameter will be used to identify the todo that needs to be updated or deleted. These ids will be generated automatically by the database when a new todo is created that we specified in the `db.js` file using the SQL queries.

### 3. Add the routes to the `server.js` file

In the `server.js` file, add the following code to include the routes in the server:

```javascript
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

/*
 ---
 Other code ↕
 ---
*/

// Routes
app.use("/auth", authRoutes); // Using the authRoutes for the /auth route
app.use("/todos", todoRoutes); // Using the todoRoutes for the /todos route
```

This code will determine the routes for the `/auth` and `/todos` paths and combine the routes.

For e.g., the `/register` route will be available at `/auth/register` and the `/` route will be available at `/todos`.

### \*Optional 4. Test the created API endpoints

You can test the API endpoints using the `todo-app.rest` file. This file contains the requests to test the API endpoints.

You can try and run the following requests:

- GET all todos (basically the home page for a logged in user)

```http
GET http://localhost:5000/todos
```

- Register a new user

```http
POST http://localhost:5000/auth/register
Content-Type: application/json

{
    "username": "john_doe@gmail.com",
    "password": "password"
}
```

- Login an existing user

```http
POST http://localhost:5000/auth/login
Content-Type: application/json

{
    "username": "john_doe@gmail.com",
    "password": "password"
}
```

You might have noticed that we have not implemented the logic for the `/register` and `/login` routes. This will result to an indefinitely waiting response in the REST client.

#### For the `/register` route:

Update the new user register endpoint to the `authRoutes.js` file:

```javascript
router.post("/register", (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  res.sendStatus(201); // 201: Created
});
```

This code will log the username and password to the console and send a `201` status code as a response.

Try running the register request again and you will see the username and password in the terminal and a `201` status code in the REST client.

These are the basic requests that you can try to test the API endpoints. You can further explore the API endpoints by adding more requests to the `todo-app.rest` file.

## Encrypting the user's password

Before we move on to the next steps, we need to encrypt the user's password before storing it in the database.

So, this encryption will work in the following way:

- When a user registers, the password will be one-way (irreversibly) encrypted and stored in the database.
- When a user logs in, the password entered by the user will be encrypted with the same algorithm and compared with the encrypted password stored in the database.

So, to do this, we will use the `bcryptjs` package.

### In your `authRoute.js` file encrypt the user's password when they register themselves on the website.

```javascript
import bcrypt from "bcryptjs";

/*
 ---
 Other code ↕
 ---
*/

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  /*-----------------------------------------*/

  // encrypt the password using bcrypt
  const hashedPassword = bcrypt.hashSync(password, 8);

  console.log(hashedPassword);

  /*-----------------------------------------*/

  res.sendStatus(201); // 201: Created
});
```

This code will encrypt the user's password using the `bcrypt.hashSync()` method and log the hashed password to the console. The second argument `8` is the number of salt rounds to be used in the hashing process.

> _Salt rounds are used to increase the security of the hashed password._

Again, this is a one-way encryption, so the password cannot be decrypted by any-means which is a **good practice** to store the user's password in the database.

## Storing the user's data in the database

Now, we will store the user's data in the database when they register on the website.

### In your `authRoute.js` file, update the `/register` route to store the user's data in the database.

```javascript
import jwt from "jsonwebtoken";
import db from "../db.js";

/*
 ---
 Other code ↕
 ---
*/

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  /*-----------------------------------------*/

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

  /*-----------------------------------------*/

  res.sendStatus(201); // 201: Created
});
```

This code will insert the user's data into the `users` table and create a default todo for the user in the `todos` table.
The `lastInsertRowid` property of the `result` object will give the id of the last inserted row.

After inserting the user's data, a JWT token will be created using the `jsonwebtoken` package and sent back to the client. This token will be used to authenticate the user in the future so that they can only access the **_todos_** that belong to them.

The `JWT_SECRET` is stored in the `.env` file and is used to sign the token.

### In your `.env` file, add the `JWT_SECRET` variable

```env
JWT_SECRET="your_secret_key_here"
PORT=5000
```

This is the secret key that will be used to sign the JWT token. You can generate a random secret key using a tool like [randomKeyGen](https://randomkeygen.com/). Or you can use any set of random words for now, just for the sake of learning and testing here.

As we are in the .env file, let's also add the PORT set to 5000.

### In your `authRoute.js` file, update the `/login` route to authenticate the user and send a JWT token.

```javascript
/*
 ---
 Other code ↕
 ---
*/

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
```

We can compare the user-entered password by using the `bcrypt.compareSync()` method. This method will compare the user-entered password with the hashed password stored in the database. If the passwords match, the method will return `true`, else it will return `false`.

If we have a successful authentication, a JWT token will be created using the `jsonwebtoken` package and sent back to the client. This token will be used to authenticate the user in the future so that they can only access the **_todos_** that belong to them.

\*_Optional_: You can check this by running the requests in the `todo-app.rest` file that are already defined above. You can try to register a new user and login with the same user to get the JWT token.

## Authenticating the user

Now, we will authenticate the user using the JWT token. We will create a middleware function that will verify the token and attach the user's id to the request object.

Add the following code to the `authMiddleware.js` file:

```javascript
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]; // ?: The token is sent in the headers of the request

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    req.userId = decoded.id;
    next();
  });
};

export default authMiddleware;
```

This code will extract the token from the `Authorization` header of the request and verify the token using the `jsonwebtoken` package. If the token is valid, the user's id will be attached to the `req` object and the `next()` function will be called to move to the next middleware function.

### In your `server.js` file, add the `authMiddleware` to the `/todos` route

```javascript
import authMiddleware from "./middleware/authMiddleware.js";

/*
 ---
 Other code ↕
 ---
*/

// Routes
app.use("/auth", authRoutes);
app.use("/todos", authMiddleware, todoRoutes);
```

This code will add the `authMiddleware` to the `/todos` route. This means that the `authMiddleware` will be executed before the `todoRoutes` checking if the user is authenticated. Only then the todos will be shown to the user.

## Implementing the CRUD operations

### 1. Get all todos for the logged-in user (Read using GET request)

In your `todoRoutes.js` file, update the `/` route to get all the todos for the logged-in user:

```javascript
import db from "../db.js";

/*
 ---
 Other code ↕
 ---
*/

// Get all todos for logged-in user
router.get("/", (req, res) => {
  const getTodos = db.prepare(`
        SELECT * FROM todos
        WHERE user_id = ?
    `);
  const todos = getTodos.all(req.userId); // ? req.userID is the id of the logged-in user

  res.json(todos);
});
```

This code will get all the todos for the logged-in user from the `todos` table and send them back to the client. The `req.userId` is the id of the logged-in user that was attached to the `req` object by the `authMiddleware`.

### 2. Create a new todo (Create using POST request)
