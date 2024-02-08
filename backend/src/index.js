import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import Response from './domain/response.js';
import HttpStatus from './controller/controller.js';
import userRoutes from './route/user.js';
import bankerRoutes from './route/banker.js';
import { getUser } from './controller/controller.js';

dotenv.config()
const app = express();
const port = 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/user', userRoutes);
app.use('/banker', bankerRoutes);

app.get('/', (req, res) => res.send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, 'Banking System API, v1.0.0 - All Systems Go')));

app.post('/login', (req,res) => getUser(req,res))

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
