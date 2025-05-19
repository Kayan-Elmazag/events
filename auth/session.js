function login(event) {
  event.preventDefault();
  const username = document.getElementById("username-input").value.trim();
  const password = document.getElementById("password-input").value.trim();

  if (username === "admin" && password === "1234") {
    localStorage.setItem("sessionUser", username);
    window.location.href = "/index.html";
  } else {
    alert("بيانات الدخول غير صحيحة");
  }
}

// Add event listener for login form
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", login);
}

// Check session on page load
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("sessionUser");
  const isLoginPage = window.location.pathname.includes("login.html");
  
  if (!user && !isLoginPage) {
    window.location.href = "/auth/login.html";
  } else if (user) {
    const userDisplay = document.getElementById("username");
    if (userDisplay) userDisplay.textContent = user;
  }
});

// Logout functionality
if (window.location.pathname.includes("logout.html")) {
  localStorage.removeItem("sessionUser");
  window.location.href = "/auth/login.html";
}