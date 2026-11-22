CREATE DATABASE IF NOT EXISTS user_login_db;
USE user_login_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the account through the application's registration helper below
-- or generate a bcrypt hash in Node.js. Never store plain-text passwords.
