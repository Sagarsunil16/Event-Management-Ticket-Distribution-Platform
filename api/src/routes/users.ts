import { Router } from "express";
import { userController } from "../container/di";
import { authenticateJWT} from "../middleware/auth";


const userRouter = Router()


userRouter.post('/register',userController.register.bind(userController))
userRouter.post('/login',userController.login.bind(userController))
userRouter.get('/me',authenticateJWT,userController.getProfile.bind(userController))
userRouter.put('/profile',authenticateJWT,userController.updateProfile.bind(userController))



export default userRouter
