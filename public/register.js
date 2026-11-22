
const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  message.textContent = "Creating your account...";
  message.className = "message";

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, email, password })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      message.textContent = result.message;
      message.className = "message success";

      registerForm.reset();

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } else {
      message.textContent = result.message || "Registration failed.";
      message.className = "message error";
    }
  } catch (error) {
    message.textContent = "Cannot connect to the server. Try again.";
    message.className = "message error";
  }
});
