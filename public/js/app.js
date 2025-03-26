document.addEventListener("DOMContentLoaded", () => {
  if (getAuthToken()) {
    loadTodos();
    setupTodoForm();
  } else {
    document.getElementById("mainContent").innerHTML = `
            <div class="text-center mt-5">
                <h2>Please login to manage your todos</h2>
                <button class="btn btn-primary mt-3" onclick="showLoginForm()">Login</button>
                <button class="btn btn-danger mt-3 ms-2" onclick="googleAuth()">
                    <i class="fab fa-google"></i> Login with Google
                </button>
            </div>
        `;
  }
});

function setupTodoForm() {
  const todoForm = document.getElementById("todoForm");
  if (!todoForm) return;

  todoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const todoId = document.getElementById("todoId").value;
    const name = document.getElementById("todoName").value;
    const description = document.getElementById("todoDescription").value;

    if (!name.trim()) {
      alert("Todo name is required");
      return;
    }

    try {
      const method = todoId ? "PUT" : "POST";
      const url = todoId ? `/api/todos/${todoId}` : "/api/todos";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ name, description }),
      });

      if (response.ok) {
        document.getElementById("todoForm").reset();
        document.getElementById("todoId").value = "";
        document.querySelector('button[type="submit"]').innerHTML =
          '<i class="fas fa-plus"></i> Add Todo';
        loadTodos();
      } else {
        if (response.status === 401) {
          alert("Your session has expired. Please login again.");
          logout();
          return;
        }
        const error = await response.json();
        alert(error.error || "Operation failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Operation failed");
    }
  });
}

async function loadTodos() {
  try {
    const response = await fetch("/api/todos", {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (response.ok) {
      const todos = await response.json();
      renderTodos(todos);
    } else {
      if (response.status === 401) {
        alert("Your session has expired. Please login again.");
        logout();
        return;
      }
      throw new Error("Failed to load todos");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to load todos");
  }
}

function renderTodos(todos) {
  const todoList = document.getElementById("todoList");
  if (!todoList) return;

  if (todos.length === 0) {
    todoList.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">No todos found</td>
            </tr>
        `;
    return;
  }

  todoList.innerHTML = todos
    .map(
      (todo) => `
        <tr>
            <td>${escapeHtml(todo.name)}</td>
            <td>${escapeHtml(todo.description || "")}</td>
            <td>${new Date(todo.created_at).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editTodo(${todo.id}, '${escapeHtml(todo.name)}', '${escapeHtml(todo.description || "")}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteTodo(${todo.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `,
    )
    .join("");
}

function editTodo(id, name, description) {
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
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (response.ok) {
        loadTodos();
      } else {
        if (response.status === 401) {
          alert("Your session has expired. Please login again.");
          logout();
          return;
        }
        const error = await response.json();
        alert(error.error || "Delete failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Delete failed");
    }
  }
}

function escapeHtml(unsafe) {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
