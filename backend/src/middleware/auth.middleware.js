import dotenv from 'dotenv';
import Response from '../domain/response.js';
import jwt from 'jsonwebtoken';
import HttpStatus from '../controller/controller.js';
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET;

const auth = (req,res,next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(HttpStatus.BAD_REQUEST.code).send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'Missing Token'))
    }
    
    const decoded = jwt.verify(authHeader.split(" ")[1], JWT_SECRET);
    if (decoded && decoded.id) {
        next()
    } else {
        return res.status(HttpStatus.BAD_REQUEST.code).send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'Invalid Token'))
    }
}

export default auth;