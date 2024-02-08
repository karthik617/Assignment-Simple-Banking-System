import express from 'express';
import auth from '../middleware/auth.middleware.js'
import {getTransaction, deposit, withdrawal, balance} from '../controller/controller.js'

const userRoutes = express.Router();

userRoutes.get('/transactions',auth,(req,res) => getTransaction(req,res))
userRoutes.post('/deposit',auth,(req,res) => deposit(req,res))
userRoutes.post('/withdraw',auth,(req,res) => withdrawal(req,res))
userRoutes.get('/balance',auth,(req,res) => balance(req,res))




export default userRoutes