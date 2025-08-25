import { Router } from "express";
import userRouter from "./users";
import eventRouter from "./events";

const mainRouter = Router()


mainRouter.use('/users',userRouter)
mainRouter.use('/events',eventRouter)

export default mainRouter