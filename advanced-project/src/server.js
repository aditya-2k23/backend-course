import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 5003;

// Get the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url); // ?: This will give access to the current file

// Get the directory name from the file path
const __dirname = dirname(__filename); // ?: This will give access to the current directory

// * Middleware
app.use(express.json());
// Serves the HTML file from the /public directory
// Tells express to serve all files from the public folder as static assets/files. Any requests for the css file will be resolved from the public folder.
app.use(express.static(path.join(__dirname, "../public")));

// This endpoint will serve up the HTML file from the /public directory
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Routes
app.use("/auth", authRoutes);
app.use("/todos", authMiddleware, todoRoutes); // ?: This means that the authMiddleware will be executed before the todoRoutes checking if the user is authenticated only then the todos will be shown to the user

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
