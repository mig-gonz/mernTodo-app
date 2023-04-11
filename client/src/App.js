import { useState, useEffect } from "react";

// define the API base URL
const API_BASE = "http://localhost:3001";

function App() {
  // define state variables with the useState hook

  // an array of todo items
  const [todos, setTodos] = useState([]);
  // whether or not the popup is visible
  const [popUpActive, setPopUpActive] = useState(false);
  // the text of the new todo item
  const [newTodo, setNewTodo] = useState("");

  // fetch the list of todos from the server when the component mounts
  useEffect(() => {
    GetTodos();

    // console.log(todos);
  }, []);

  // function to fetch the list of todos from the server
  const GetTodos = () => {
    fetch(API_BASE + "/todos")
      .then((result) => result.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("Error: ", err));
  };

  // function to mark a todo item as complete
  const completeTodo = async (id) => {
    const data = await fetch(API_BASE + "/todo/complete/" + id).then((res) =>
      res.json()
    );

    // update the todos state by mapping over the array and replacing the completed item
    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }

        return todo;
      })
    );
  };

  // function to delete a todo item
  const deleteTodo = async (id) => {
    const data = await fetch(API_BASE + "/todo/delete/" + id, {
      method: "DELETE",
    }).then((res) => res.json());

    // update the todos state by removing the deleted item
    setTodos((todos) => todos.filter((todo) => todo._id !== data._id));
  };

  // function to add a new todo item
  const addTodo = async () => {
    const data = await fetch(API_BASE + "/todo/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newTodo,
      }),
    }).then((res) => res.json());

    // update the todos state by adding the new item to the end of the array
    setTodos([...todos, data]);

    // close the popup and reset the newTodo state variable
    setPopUpActive(false);
    setNewTodo("");
  };

  return (
    <div className="App">
      <h1>Welcome, Miguel</h1>
      <h4>Your tasks</h4>

      <div className="todos">
        {todos.map((todo) => (
          <div
            className={"todo " + (todo.complete ? "is-complete" : "")}
            key={todo._id}
            onClick={() => completeTodo(todo._id)}
          >
            <div className="checkbox"></div>

            <div className="text">{todo.text}</div>

            <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>
              x
            </div>
          </div>
        ))}
      </div>

      <div className="addPopup" onClick={() => setPopUpActive(true)}>
        +
      </div>
      {popUpActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopUpActive(false)}>
            x
          </div>
          <div className="content">
            <h3>Add Task</h3>
            <input
              type="text"
              className="add-todo-input"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />
            <div className="button" onClick={addTodo}>
              Create Task
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
