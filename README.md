# User Login Validation (HTML, CSS, JavaScript, Node.js and MySQL)

## Requirements
- Node.js (LTS)
- MySQL Server
- A terminal (VS Code terminal is fine)

## 1. Create the database
Open MySQL Workbench or the MySQL command line and run the contents of `database.sql`.

## 2. Configure the application
In the project folder, copy `.env.example` to a new file named `.env`.
Edit `.env` and enter your MySQL username/password. Set `SESSION_SECRET` to a long random value.
Do not upload `.env` to GitHub.

## 3. Install packages
```bash
npm install
```

## 4. Create a test user
```bash
node create-user.js student Student@123
```
This stores a bcrypt password hash, not the plain-text password. Choose your own test password.

## 5. Start the server
```bash
npm start
```
Open http://localhost:3000 in your browser and sign in using the test account you created.

## How it works
1. The browser sends the username and password to `POST /api/login`.
2. Node.js queries MySQL using a parameterized query.
3. bcrypt compares the submitted password with the stored password hash.
4. A valid login creates a server-side session and redirects to `welcome.html`.
5. Invalid credentials return a failure message.

## Important
- Do not open `public/index.html` directly or use the VS Code Live Server extension for this project. Start Node.js and visit `http://localhost:3000`.
- Do not store plain-text passwords.
- For production, use HTTPS and a persistent session store instead of Express's default in-memory session store.
