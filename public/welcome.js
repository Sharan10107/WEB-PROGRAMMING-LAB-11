
// Check whether the user is logged in
async function checkLogin() {
  try {
    const response = await fetch("/api/me", {
      method: "GET",
      credentials: "same-origin"
    });

    if (!response.ok) {
      window.location.replace("/login.html");
      return;
    }

    const user = await response.json();

    document.getElementById("welcomeMessage").textContent =
      "Welcome, " + user.username + "!";

  } catch (error) {
    console.error("Login check failed:", error);
    window.location.replace("/login.html");
  }
}

// Logout button functionality
document.getElementById("logoutButton").addEventListener("click", async () => {
  const message = document.getElementById("message");
  const logoutButton = document.getElementById("logoutButton");

  logoutButton.disabled = true;
  message.textContent = "Logging out...";

  try {
    const response = await fetch("/api/logout", {
      method: "POST",
      credentials: "same-origin"
    });

    const result = await response.json();

    if (response.ok && result.success) {
      window.location.replace("/login.html");
    } else {
      message.textContent = result.message || "Could not log out. Please try again.";
      logoutButton.disabled = false;
    }

  } catch (error) {
    console.error("Logout failed:", error);
    message.textContent = "Unable to connect to the server.";
    logoutButton.disabled = false;
  }
});

// Run login check when the page loads
checkLogin();
