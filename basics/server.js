// The address of this server connected to the network is: http://localhost:8383
// URL -> http://localhost:8383
// IP -> 127.0.0.1:8383

const express = require("express");
const app = express();
const PORT = 8383;

let data = ["Aditya"];

// Middleware - It is a function that runs between the request and the response.
app.use(express.json());

// Type 1 : Website endpoints - These endpoints are for sending back html and they typically renders when a user enters a URL in the browser.

// app.get("/", (req, res) => {
//   res.send("<h1>Welcome to the home page</h1>");
//   res.sendStatus(201);
// });

app.get("/", (req, res) => {
  res.send(`
        <body style="background-color: #f0f0f0; text-align: center;">
            <h1>Data</h1>
            <p>${JSON.stringify(data)}</p>
            <a href="/dashboard">Dashboard</a>

            <script>console.log("This is a script")</script>
        </body>
    `);
});

app.get("/dashboard", (req, res) => {
  res.send(`
    <body>
        <h1>Welcome to the dashboard<h1>
        <a href="/">Home</a>
    </body>
    `);
  res.sendStatus(200);
});

// Type 2 : API endpoints

app.get("/api/data", (req, res) => {
  console.log("This is for data");
  res.status(599).send(data); // 599 is a custom status code
  // We can also send a status code with the response.
});

app.post("/api/data", (req, res) => {
  // Let's say someone wants to create an account on our website and they send their data to us.
  // We will store that data in our database.
  const newEntry = req.body;
  console.log(newEntry);
  data.push(newEntry.name);
  res.sendStatus(201);
});

app.delete("/api/data", (req, res) => {
  data.pop();
  console.log("Element deleted at the end of the array");

  res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
