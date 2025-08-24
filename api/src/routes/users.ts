import { Router } from "express";
import { userController } from "../container/di";


const userRouter = Router()


userRouter.post('/register',userController.register.bind(userController))
userRouter.post('/login',userController.login.bind(userController))
userRouter.get('/:id',userController.getProfile)



export default userRouter
