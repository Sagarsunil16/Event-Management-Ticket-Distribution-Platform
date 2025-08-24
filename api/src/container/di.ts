import { UserController } from "../controllers/UserController";
import { UserRepository } from "../repositories/UserRepository";
import { UserService } from "../services/UserService";

const userRepo = new UserRepository()






const userService = new UserService(userRepo)





const userController = new UserController(userService)


export {userController}