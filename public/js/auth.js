let currentUser = null;
const authModal = document.getElementById("authModal");

document.addEventListener("DOMContentLoaded", () => {
  checkAuthStatus();
  setupAuthForms();
  setupModalClose();
  setupLoginButtons();
});

function setupLoginButtons() {
  // Add click event listeners to login and register buttons in the navbar
  const loginButton = document.querySelector(".btn-login");
  if (loginButton) {
    loginButton.addEventListener("click", showLoginForm);
  }

  const registerButton = document.querySelector(".btn-register");
  if (registerButton) {
    registerButton.addEventListener("click", showRegisterForm);
  }

  // Setup toggle links between login and register forms
  const toRegisterLink = document.getElementById("toRegisterForm");
  if (toRegisterLink) {
    toRegisterLink.addEventListener("click", (e) => {
      e.preventDefault();
      showRegisterForm();
    });
  }

  const toLoginLink = document.getElementById("toLoginForm");
  if (toLoginLink) {
    toLoginLink.addEventListener("click", (e) => {
      e.preventDefault();
      showLoginForm();
    });
  }
}

function setupAuthForms() {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }
}

function setupModalClose() {
  // Close modal when clicking outside
  window.onclick = function (event) {
    if (event.target === authModal) {
      closeAuthModal();
    }
  };

  // Close modal when clicking X button
  const closeButton = document.querySelector(".btn-close");
  if (closeButton) {
    closeButton.addEventListener("click", closeAuthModal);
  }
}

function showLoginForm() {
  document.getElementById("authModalTitle").textContent = "Login";
  document.getElementById("loginForm").classList.remove("d-none");
  document.getElementById("registerForm").classList.add("d-none");
  authModal.style.display = "block";
  authModal.classList.add("show");
}

function showRegisterForm() {
  document.getElementById("authModalTitle").textContent = "Register";
  document.getElementById("loginForm").classList.add("d-none");
  document.getElementById("registerForm").classList.remove("d-none");
  authModal.style.display = "block";
  authModal.classList.add("show");
}

function closeAuthModal() {
  authModal.style.display = "none";
  authModal.classList.remove("show");
  // Reset forms
  document.getElementById("loginForm").reset();
  document.getElementById("registerForm").reset();
}

async function handleLogin(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.get("username"),
        password: formData.get("password"),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setAuthToken(data.token);
      setCurrentUser(data.user);
      closeAuthModal();
      location.reload();
    } else {
      const error = await response.json();
      alert(error.error || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed");
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setAuthToken(data.token);
      setCurrentUser(data.user);
      closeAuthModal();
      location.reload();
    } else {
      const error = await response.json();
      alert(error.error || "Registration failed");
    }
  } catch (error) {
    console.error("Registration error:", error);
    alert("Registration failed");
  }
}

function googleAuth() {
  // Store current page URL for redirect after Google auth
  localStorage.setItem("preAuthPage", window.location.href);

  // Create and append a hidden form
  const form = document.createElement("form");
  form.method = "GET";
  form.action = "/api/auth/google";

  // Add state parameter to prevent CSRF
  const state = btoa(Math.random().toString());
  localStorage.setItem("oauthState", state);

  const stateInput = document.createElement("input");
  stateInput.type = "hidden";
  stateInput.name = "state";
  stateInput.value = state;

  form.appendChild(stateInput);
  document.body.appendChild(form);
  form.submit();
}

// Check if we're returning from Google OAuth
window.addEventListener("load", function () {
  const params = new URLSearchParams(window.location.search);
  if (params.has("token") && params.has("user")) {
    try {
      const token = params.get("token");
      const user = JSON.parse(decodeURIComponent(params.get("user")));
      setAuthToken(token);
      setCurrentUser(user);

      // Redirect to pre-auth page or default page
      const redirect = localStorage.getItem("preAuthPage") || "/";
      localStorage.removeItem("preAuthPage");
      window.location.href = redirect;
    } catch (error) {
      console.error("Error processing auth response:", error);
    }
  }
});

function setAuthToken(token) {
  localStorage.setItem("token", token);
}

function getAuthToken() {
  return localStorage.getItem("token");
}

function setCurrentUser(user) {
  currentUser = user;
  localStorage.setItem("user", JSON.stringify(user));
  updateUIForAuth();
}

function checkAuthStatus() {
  const token = getAuthToken();
  const user = localStorage.getItem("user");
  if (token && user) {
    currentUser = JSON.parse(user);
    updateUIForAuth();
  }
}

function updateUIForAuth() {
  const authButtons = document.getElementById("authButtons");
  const userInfo = document.getElementById("userInfo");
  const username = document.getElementById("username");

  if (!authButtons || !userInfo) return;

  if (currentUser) {
    authButtons.classList.add("d-none");
    userInfo.classList.remove("d-none");
    if (username) {
      username.textContent = currentUser.username;
    }
  } else {
    authButtons.classList.remove("d-none");
    userInfo.classList.add("d-none");
    if (username) {
      username.textContent = "";
    }
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  currentUser = null;
  updateUIForAuth();
  location.reload();
}
