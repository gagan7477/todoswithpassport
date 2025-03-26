document.addEventListener("DOMContentLoaded", () => {
  loadTodos();

  document.getElementById("todoForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("todoName").value;
    const description = document.getElementById("todoDescription").value;
    const todoId = document.getElementById("todoId").value;

    try {
      const method = todoId ? "PUT" : "POST";
      const url = todoId ? `/api/todos/${todoId}` : "/api/todos";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
      });

      if (response.ok) {
        document.getElementById("todoForm").reset();
        document.getElementById("todoId").value = "";
        document.querySelector('button[type="submit"]').innerHTML =
          '<i class="fas fa-plus"></i> Add Todo';
        loadTodos();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
});

async function loadTodos() {
  try {
    const response = await fetch("/api/todos");
    const todos = await response.json();
    const todoList = document.getElementById("todoList");

    todoList.innerHTML = todos
      .map(
        (todo) => `
            <tr class="todo-item">
                <td>${escapeHtml(todo.name)}</td>
                <td>${escapeHtml(todo.description || "")}</td>
                <td>${new Date(todo.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-action btn-edit" onclick="editTodo(${todo.id}, '${escapeHtml(todo.name)}', '${escapeHtml(todo.description || "")}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-action btn-delete" onclick="deleteTodo(${todo.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `,
      )
      .join("");
  } catch (error) {
    console.error("Error:", error);
  }
}

async function editTodo(id, name, description) {
  document.getElementById("todoId").value = id;
  document.getElementById("todoName").value = name;
  document.getElementById("todoDescription").value = description;
  document.querySelector('button[type="submit"]').innerHTML =
    '<i class="fas fa-save"></i> Update Todo';
  document.getElementById("todoName").focus();
}

async function deleteTodo(id) {
  if (confirm("Are you sure you want to delete this todo?")) {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        loadTodos();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
