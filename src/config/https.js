import axios from "axios";
// import dotenv from "dotenv"
// dotenv.config()
console.log(process.env.REACT_APP_BASE_URL );
const https = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL 
});

export default https;
