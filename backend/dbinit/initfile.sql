CREATE USER IF NOT EXISTS root@localhost IDENTIFIED BY 'password';
SET PASSWORD FOR root@localhost = PASSWORD('password');
GRANT ALL ON *.* TO root@localhost WITH GRANT OPTION;
CREATE USER IF NOT EXISTS root@'%' IDENTIFIED BY 'password';
SET PASSWORD FOR root@'%' = PASSWORD('password');
GRANT ALL ON *.* TO root@'%' WITH GRANT OPTION;
CREATE USER IF NOT EXISTS myuser@'%' IDENTIFIED BY 'pass';
SET PASSWORD FOR myuser@'%' = PASSWORD('pass');
CREATE DATABASE IF NOT EXISTS Bank;
GRANT ALL ON Bank.* TO myuser@'%';

USE Bank;

-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    balance DECIMAL(10, 2) NOT NULL,
    role ENUM('banker', 'customer') NOT NULL
);

-- Create Accounts table
CREATE TABLE IF NOT EXISTS Accounts (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_type ENUM('deposit', 'withdrawal') NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

INSERT INTO Users (username, email, password, balance, role) VALUES ('john_doe', 'john.doe@example.com', 'password123', 1000.00, 'customer'),
('jane_smith', 'jane.smith@example.com', 'securepass', 2500.50, 'customer'),
('bank_manager', 'manager@bank.com', 'bankpass', 50000.00, 'banker');

INSERT INTO Accounts (user_id, amount, transaction_type) VALUES (1, 500.00, 'deposit'), (2, 1000.00, 'deposit'),(1, 200.00, 'withdrawal');


