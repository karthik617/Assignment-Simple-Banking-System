import database from '../config/mysql.js'
import Query from '../query/query.js';
import dotenv from 'dotenv';
import Response from '../domain/response.js';
import jwt from 'jsonwebtoken';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const HttpStatus = {
    OK: { code: 200, status: 'OK' },
    BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
    NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
    INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' }
  };

  export const getUser = (req, res) => {
    database.query(Query.CHECK_USER,Object.values(req.body), (error, results) => {
      if(error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, 'Internal server error'))
      }
      if (results.length === 0) {
        res.status(HttpStatus.OK.code)
          .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `No User found`));
      } else {
        const token = jwt.sign(
          {
            id: results[0].user_id,
          },
          JWT_SECRET
        );
        res.status(HttpStatus.OK.code)
          .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `User retrieved`, { user: results[0], token: token}));
      }
    });
  };

  export const getTransaction = (req, res) => {
    database.query(Query.GET_TRANSACTION,Number(Object.values(req.query)), (error, results) => {
      if(error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, 'Internal server error'))
      }
      
      if (results.length === 0) {
        res.status(HttpStatus.OK.code)
          .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `No User Transaction found`));
      } else {
        res.status(HttpStatus.OK.code)
          .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `User Transaction retrieved`, { transaction: results,}));
      }
    });
  };
  export const balance = (req, res) => {
    database.query(Query.GET_BALANCE,Number(Object.values(req.query)), (error, results) => {
      if(error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, 'Internal server error'))
      }
      res.status(HttpStatus.OK.code)
                .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Your Balance`, {balance: results[0].balance}));
    })
  }
  export const deposit = (req, res) => {
    try {
      const { user_id, amount, type } = req.body;
      if (!user_id || !amount || !type) {
          throw new Error('Invalid request parameters');
      }
  
      // Start transaction
      database.query('START TRANSACTION', (error) => {
          if (error) {
              throw new Error('Failed to start transaction');
          }
  
          // Record deposit transaction
          database.query(Query.DEPOSIT, [user_id, amount, type], (error, depositResults) => {
              if (error) {
                  database.query('ROLLBACK', () => {
                      throw new Error('Failed to record deposit transaction');
                  });
              }
  
              // Update user balance
              database.query(Query.ADD_BALANCE, [amount, user_id], (error, updateResults) => {
                  if (error) {
                      database.query('ROLLBACK', () => {
                          throw new Error('Failed to update user balance');
                      });
                  }
  
                  // Commit transaction if successful
                  database.query('COMMIT', (error) => {
                      if (error) {
                          database.query('ROLLBACK', () => {
                              throw new Error('Failed to commit transaction');
                          });
                      }
  
                      // Send success response
                      res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, 'Transaction Complete'));
                  });
              });
          });
      });
  } catch (error) {
      // Send error response
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, 'Internal server error'));
  }
  
  };
  export const withdrawal = (req, res) => {
    try {
      let [user_id, amount, type] = Object.values(req.body);
      let balance;
  
      // Fetch current balance
      database.query(Query.GET_BALANCE, [user_id], (error, results) => {
          if (error) {
              throw new Error('Failed to fetch balance');
          }
  
          balance = results[0].balance;
  
          if (balance < amount) {
              // Insufficient balance
              res.status(HttpStatus.OK.code)
                  .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `No Sufficient Balance`));
          } else {
              // Sufficient balance, proceed with withdrawal
              database.query(Query.WITHDRAW, [user_id, amount, type], (error, results) => {
                  if (error) {
                      throw new Error('Failed to withdraw amount');
                  }
  
                  // Update balance
                  database.query(Query.SUB_BALANCE, [amount, user_id], (error, results) => {
                      if (error) {
                          throw new Error('Failed to update balance after withdrawal');
                      }
  
                      // Send success response
                      res.status(HttpStatus.OK.code)
                          .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Transaction Complete`));
                  });
              });
          }
      });
  } catch (error) {
      // Send internal server error response
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
          .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, 'Internal server error'));
  }
  
  };
  export const allUser = (req, res) => {
    database.query(Query.GET_USER, (error, results) => {
      if(error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, 'Internal server error'))
      }
      
      if (results.length === 0) {
        res.status(HttpStatus.OK.code)
          .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `No Users found`));
      } else {
        res.status(HttpStatus.OK.code)
          .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `All User retrieved`, { users: results.filter((i) => i.role !== 'banker')}));
      }
    });
  };
export default HttpStatus;