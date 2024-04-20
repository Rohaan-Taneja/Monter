import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import express from "express";
dotenv.config();




const app = express();

// express middlewares setup for the incoming data 

app.use(express.json({limit: "10kb"}))

app.use(express.urlencoded({extended:true}))

app.use(express.static("public"))

app.use(cookieParser())



// importing routers

import userRouter from "./Routes/user.route.js";



// query is passed to the user router 
app.use("/api/v1/users" ,userRouter );

export default app;