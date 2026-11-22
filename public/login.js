
const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  message.textContent = "Checking your login...";
  message.className = "message";

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      window.location.href = result.redirect;
    } else {
      message.textContent = result.message || "Login failed.";
      message.className = "message error";
    }
  } catch (error) {
    message.textContent = "Cannot connect to the server. Try again.";
    message.className = "message error";
  }
});
