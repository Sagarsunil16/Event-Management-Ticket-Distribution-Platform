import { Router } from "express";
import userRouter from "./users";
import eventRouter from "./events";
import ticketRouter from "./ticket";
import paymentRouter from "./payment";

const mainRouter = Router()


mainRouter.options('*', (req, res) => {
  res.status(200).send(); 
});

mainRouter.use('/users',userRouter)
mainRouter.use('/events',eventRouter)
mainRouter.use('/tickets',ticketRouter)
mainRouter.use('/payment', paymentRouter); 

export default mainRouter