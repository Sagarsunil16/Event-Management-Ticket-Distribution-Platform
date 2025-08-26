import { EventController } from "../controllers/EventController";
import { PaymentController } from "../controllers/PaymentController";
import { TicketController } from "../controllers/TicketController";
import { UserController } from "../controllers/UserController";
import { EventRepository } from "../repositories/EventRepository";
import { TicketRepository } from "../repositories/TicketRepository";
import { UserRepository } from "../repositories/UserRepository";
import { EventService } from "../services/EventService";
import { PaymentService } from "../services/PaymentService";
import { TicketService } from "../services/TicketService";
import { UserService } from "../services/UserService";

//Repositories
const userRepo = new UserRepository();
const eventRepo = new EventRepository();
const ticketRepo = new TicketRepository();



//Services
const userService = new UserService(userRepo);
const eventService = new EventService(eventRepo);
const ticketService = new TicketService(ticketRepo,eventRepo);
const paymentService = new PaymentService(eventService,ticketService)


//Controllers
const userController = new UserController(userService);
const eventController = new EventController(eventService);
const ticketController = new TicketController(ticketService);
const paymentController = new PaymentController(paymentService,eventService)

export {userController,eventController,ticketController,paymentController}