dotenv.config()
import express from "express"

import dotenv from "dotenv"


const app = express();

// express middlewares setup for the incoming data 

app.use(express.json({limit: "10kb"}))

app.use(express.urlencoded({extended:true}))

app.use(express.static("public"))

export default app;