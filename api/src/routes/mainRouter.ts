import { Router } from "express";
import userRouter from "./users";
import eventRouter from "./events";
import ticketRouter from "./ticket";

const mainRouter = Router()


mainRouter.use('/users',userRouter)
mainRouter.use('/events',eventRouter)
mainRouter.use('/tickets',ticketRouter)

export default mainRouter