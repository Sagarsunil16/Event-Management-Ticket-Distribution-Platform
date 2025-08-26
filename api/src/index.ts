import express, { NextFunction, Request, Response, Router } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { CustomError } from './utils/CustomError'
import mainRouter from './routes/mainRouter'
import mongoConnect from './config/db'
import webhookRouter from './routes/webhook'

dotenv.config()

const app = express()
mongoConnect()

app.use("/webhook", webhookRouter);

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

const allowedOrigins = ["http://localhost:5173","https://event-management-ticket-distributio.vercel.app"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(mainRouter)

app.use((error:Error,req:Request,res:Response,next:NextFunction)=>{
    if(error instanceof CustomError){
        return res.status(error.statusCode).json({error:error.message})
    }else{
        console.log(error)
        res.status(500).json({error:"An unexpected error occurred. Please try again later."})
    }
})

app.listen(process.env.PORT,()=>{
    console.log(`Server is listening on port ${process.env.PORT}`)
})