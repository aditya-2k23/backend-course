import express from "express";
import db from "../db.js";

const router = express.Router();

// Get all todos for logged-in user
router.get("/", (req, res) => {
  const getTodos = db.prepare(`
        SELECT * FROM todos
        WHERE user_id = ?
    `);
  const todos = getTodos.all(req.userId); // ? req.userID is the id of the logged-in user

  res.json(todos);
});

// Create a new todo
router.post("/", (req, res) => {});

// Update a todo
router.put("/:id", (req, res) => {}); // ?: The ":id" is used to capture the id of the todo that we want to update

// Delete a todo
router.delete("/:id", (req, res) => {}); // ?: Same as above, the ":id" is used to capture the id of the todo that we want to delete

export default router;
