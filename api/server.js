const express = require("express"); // handles our server
const mongoose = require("mongoose"); // handles our database
const cors = require("cors"); //prevent malicious attack
const Todo = require("./models/todo"); // imports Todo schema from models/todo.js

// using var "app" as express()
const app = express();

//  middleware
app.use(express.json());
app.use(cors());
app.use(express.json()); // Parse incoming requests with JSON payloads

// Connect to the MongoDB database
mongoose
  .connect("mongodb://localhost:27017/mern-todo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB")) // Log a message if the connection is successful
  .catch(console.error); // Log any errors that occur during connection

// Retrieve all todos from the database
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// Create a new todo and save it to the database
app.post("/todo/new", (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });

  todo.save();

  res.json(todo);
});

// Delete a todo from the database by ID
app.delete("/todo/delete/:id", async (req, res) => {
  const result = await Todo.findByIdAndDelete(req.params.id);
  res.json(result);
});

// Toggle the 'complete' status of a todo by ID
app.get("/todo/complete/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    todo.complete = !todo.complete;

    todo.save();

    res.json(todo);
  } catch (error) {
    // If an error occurs, log it and send a 500 response to the client
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(3001, () => console.log("Server started on port 3001"));
