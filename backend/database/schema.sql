-- Users table for authentication
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Modify your existing instagram_profiles table to add PRIMARY KEY
ALTER TABLE instagram_profiles
MODIFY id INT NOT NULL AUTO_INCREMENT,
ADD PRIMARY KEY (id);