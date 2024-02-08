import express from 'express';
import auth from '../middleware/auth.middleware.js'
import {getTransaction, allUser} from '../controller/controller.js'

const bankerRoutes = express.Router();

bankerRoutes.get('/',auth,(req,res) => allUser(req,res))
bankerRoutes.get('/transactionshistory',auth,(req,res) => getTransaction(req,res))


export default bankerRoutes