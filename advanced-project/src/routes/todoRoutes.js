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
router.post("/", (req, res) => {
  const { task } = req.body;
  const insertTodo = db.prepare(`
        INSERT INTO todos (user_id, task)
        VALUES (?, ?)
    `);
  const result = insertTodo.run(req.userId, task); // *

  res.json({ id: result.lastInsertRowid, task, completed: 0 });
});

// Update a todo
router.put("/:id", (req, res) => {
  const { completed } = req.body;
  const { id } = req.params; // ? req.params is an object containing properties mapped to the named route “parameters”. For example, if you have the route /user/:name, then the “name” property is available as req.params.name. This object defaults to {}.
  const { page } = req.query; // ? req.query is an object containing a property for each query string parameter in the route. If there is no query string, it is an empty object: {}. For example, if you have the route /search?q=toby, then the “q” property is available as req.query.q. This object defaults to {}.

  const updatedTodo = db.prepare(`
    UPDATE todos SET completed = ?
    WHERE id = ?
  `);

  updatedTodo.run(completed, id); // ? This will update the completed status of the todo with the given id

  res.json({ message: "Todo completed!" });
}); // ?: The ":id" is used to capture the id of the todo that we want to update

// Delete a todo
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const deleteTodo = db.prepare(`
    DELETE FROM todos
    WHERE id = ? AND user_id = ?
  `);

  deleteTodo.run(id, req.userId); // ? This will delete the todo with the given id
  res.send({ message: "Todo deleted!" });
}); // ?: Same as above, the ":id" is used to capture the id of the todo that we want to delete

export default router;
