import { Router } from "express";
import { userController } from "../container/di";
import { authenticatedJWT } from "../middleware/auth";


const userRouter = Router()


userRouter.post('/register',userController.register.bind(userController))
userRouter.post('/login',userController.login.bind(userController))
userRouter.get('/:id',userController.getProfile.bind(userController))



export default userRouter
