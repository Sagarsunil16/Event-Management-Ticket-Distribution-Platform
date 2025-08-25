import { EventController } from "../controllers/EventController";
import { UserController } from "../controllers/UserController";
import { EventRepository } from "../repositories/EventRepository";
import { UserRepository } from "../repositories/UserRepository";
import { EventService } from "../services/EventService";
import { UserService } from "../services/UserService";

const userRepo = new UserRepository()
const eventRepo = new EventRepository()





const userService = new UserService(userRepo)
const eventService = new EventService(eventRepo)




const userController = new UserController(userService)
const eventController = new EventController(eventService)

export {userController,eventController}