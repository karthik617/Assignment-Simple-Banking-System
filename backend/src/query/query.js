const Query = {
    CHECK_USER: 'SELECT * FROM Users WHERE email = ? AND PASSWORD = ?',
    GET_USER: 'SELECT * FROM Users',
    GET_TRANSACTION: 'SELECT * FROM Accounts WHERE user_id = ? ORDER BY transaction_date DESC',
    DEPOSIT: 'INSERT INTO Accounts (user_id, amount, transaction_type) VALUES(?, ?, ?)',
    WITHDRAW: 'INSERT INTO Accounts (user_id, amount, transaction_type) VALUES(?, ?, ?)',
    ADD_BALANCE: 'UPDATE Users SET balance = balance + ? WHERE user_id = ?',
    SUB_BALANCE: 'UPDATE Users SET balance = balance - ? WHERE user_id = ?',
    GET_BALANCE: 'SELECT balance FROM Users WHERE user_id = ?'
}

export default Query;