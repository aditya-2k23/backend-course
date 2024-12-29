# Basic Backend Development

First we need to initialize `package.json` file using the following command:

```bash
npm init -y
```

Then using _*express*_ we can start a local server selected on a port and listen for requests.

## Express

Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

### Installing express

```bash
npm install express
```

### Setting up a server using express

To set up a server using express, we can use the following code:

```javascript
const express = require("express");
const app = express();

const PORT = 3000;

// *Optional* - Setting up a route
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

### Running a server using express

To run the server, we can use the following command:

```bash
node server.js
```

But when we change anything in the code, we have to stop the server and start it again to see the changes.

To avoid this, we can use _*nodemon*_.

## Nodemon

Nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.

### Running the server using nodemon

To run the server, we can use the command:

```bash
nodemon server.js
```

- Note: But let's say we want to change the tool to run the server, we have to remember the command each time we want to run the server.

To avoid this, we can use _*npm scripts*_.

## NPM Scripts

NPM scripts are defined in the `package.json` file.

### Defining a script

To define a script, we can add a new property to the `scripts` object in the `package.json` file.

```json
"scripts": {
  "dev": "nodemon server.js"
}
```

### Running the server using npm scripts

To run the server using npm scripts, we can use the command:

```bash
npm run dev
```

- Note: So, by doing this we only have to change the tool name in the `package.json` file instead of remembering the command each time we want to run the server.

## Endpoints

Endpoints are the URLs where our server can be accessed. They can be accessed using different types of requests.

### Requests to create an endpoint

There are different types of requests that can be made to the server:

- GET
- POST
- PUT
- DELETE

### Setting up an endpoint

To set up an endpoint, we can use the following code:

```javascript
app.get("/", (req, res) => {
  // endpoint 1 for home ("/") route
  res.send("Hello World!");
});
```

```javascript
app.get("/about", (req, res) => {
  // endpoint 2 for about ("/about") route
  res.send("About Us");
});
```

So, as we can see, in an endpoint there is a HTTP verb (methods) followed by the path (route) and a callback function that takes two parameters: `req` and `res`.

- `req` is the request object that contains information about the request.
- `res` is the response object that contains information about the response.

### Sending a response

To send a response, we can use the `send` method of the `res` object.

```javascript
res.send("Hello World!");
```

- Note - We can also send HTML code and not only these strings using the `send` method.

```javascript
res.send("<h1>Hello World!</h1>");
```

## CRUD Operations

CRUD stands for Create, Read, Update, and Delete.

All the operations that can be performed on a resource are categorized into these four operations.

And these operations can be performed using the following HTTP methods (verbs):

- POST - Create
- GET - Read
- PUT - Update
- DELETE - Delete

### Setting up CRUD operations

To set up CRUD operations, we can use the following code:

```javascript
// Create
app.post("/api/users", (req, res) => {
  // creating a new user
  res.send("User created");
});

// Read
app.get("/api/users", (req, res) => {
  // getting all users
  res.send("All users");
});

app.get("/api/users/:id", (req, res) => {
  // getting a user by id
  res.send("User by id");
});

// Update
app.put("/api/users/:id", (req, res) => {
  // updating a user by id
  res.send("User updated");
});

// Delete
app.delete("/api/users/:id", (req, res) => {
  // deleting a user by id
  res.send("User deleted");
});
```

- Note: In the above code, we have set up CRUD operations for a resource called `users`.

## Types of Endpoints

### Type 1: Website endpoints

Website endpoints are used to render some HTML code.

#### Setting up a website endpoint

```javascript
app.get("/", (req, res) => {
  // sending the homepage code to the client
  res.sendFile(__dirname + "/index.html");
});
```

### Type 2: API endpoints

API endpoints are used to interact with the server to get some data.

#### Setting up an API endpoint

```javascript
app.get("/api/users", (req, res) => {
  // sending the users data to the client
  res.json([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Doe" },
  ]);
});
```

## Middleware

Middleware functions are functions that have access to the request object (`req`), the response object (`res`), and the next middleware function in the application’s request-response cycle.

### Setting up a middleware

```javascript
app.use(express.json());
```

In the above code, we are using a middleware function called `express.json()`. Which is used to parse the incoming requests with JSON payloads.

We can also create our own middleware functions.

```javascript
app.use((req, res, next) => {
  console.log("Middleware function");
  next(); // calling the next middleware function
  // If we don't call the next function, the request-response cycle will be stuck here
});
```

- Note: Middleware functions can perform the following tasks:
  - Execute any code.
  - Make changes to the request and the response objects.
  - End the request-response cycle.
  - Call the next middleware function in the stack.
