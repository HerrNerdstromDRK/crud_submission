import React from "react";

export default function Todo({ todo, toggleTodo }) {
  function handleTodoClick() {
    console.log("Todo> Calling toggleTodo() with id: " + todo.id);
    toggleTodo(todo.id);
  }

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={todo.complete}
          onChange={handleTodoClick}
        />
        {todo.name}
      </label>
    </div>
  );
}
