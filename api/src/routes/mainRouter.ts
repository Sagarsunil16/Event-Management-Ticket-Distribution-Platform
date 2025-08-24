import { Router } from "express";
import userRouter from "./users";

const mainRouter = Router()


mainRouter.use('/',userRouter)


export default mainRouter