import { Router } from "express";
import { authenticateJWT } from "../middleware/auth";
import { authorizeRoles } from "../middleware/authorize";
import { ticketController } from "../container/di";

const ticketRouter =  Router()

ticketRouter.post('/book', authenticateJWT, authorizeRoles('attendee'), ticketController.book.bind(ticketController));
ticketRouter.post('/cancel', authenticateJWT, authorizeRoles('attendee'), ticketController.cancel.bind(ticketController));
ticketRouter.get('/my', authenticateJWT, authorizeRoles('attendee'), ticketController.myTickets.bind(ticketController));

export default ticketRouter