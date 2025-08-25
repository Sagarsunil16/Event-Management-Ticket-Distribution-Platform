import { Router } from "express";
import { eventController } from "../container/di";
import { authenticateJWT } from "../middleware/auth";
import { authorizeRoles } from "../middleware/authorize";


const eventRouter = Router()

eventRouter.get('/', eventController.listEvents.bind(eventController));
eventRouter.get('/:id', eventController.getEventById);

// Protected Routes (organizer only)
eventRouter.post('/', authenticateJWT, authorizeRoles('organizer'), eventController.createEvent.bind(eventController));
eventRouter.put('/:id', authenticateJWT, authorizeRoles('organizer'), eventController.updateEvent.bind(eventController));
eventRouter.delete('/:id', authenticateJWT, authorizeRoles('organizer'), eventController.deleteEvent.bind(eventController));
eventRouter.get('/organizer/events', authenticateJWT, authorizeRoles('organizer'), eventController.listOrganizerEvents.bind(eventController));


export default eventRouter