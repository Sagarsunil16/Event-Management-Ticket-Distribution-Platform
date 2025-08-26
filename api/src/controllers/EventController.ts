import { NextFunction, Request, Response } from 'express';
import { IEventService } from '../services/interfaces/IEventService';
import { AuthRequest } from '../middleware/auth';

export class EventController {
    private _eventService: IEventService;

    constructor(eventService: IEventService) {
        this._eventService = eventService;
        console.log("✅ EventController initialized");
    }

    async createEvent(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        console.log("🎯 createEvent called");
        try {
            const organizerId = req.user!.id;
            console.log("Organizer ID:", organizerId, "Body:", req.body);
            const event = await this._eventService.createEvent({ ...req.body, organizerId });
            res.status(201).json(event);
        } catch (err: any) {
            console.error("❌ Error in createEvent:", err);
            next(err);
        }
    };

    async updateEvent(req: AuthRequest, res: Response, next: NextFunction) {
        console.log("🎯 updateEvent called with ID:", req.params.id);
        try {
            const organizerId = req.user!.id;
            console.log("Organizer ID:", organizerId, "Update Body:", req.body);
            const event = await this._eventService.updateEvent(req.params.id, req.body, organizerId);
            res.status(200).json(event);
        } catch (err: any) {
            console.error("❌ Error in updateEvent:", err);
            next(err);
        }
    };

    async deleteEvent(req: AuthRequest, res: Response, next: NextFunction) {
        console.log("🎯 deleteEvent called with ID:", req.params.id);
        try {
            const organizerId = req.user!.id;
            console.log("Organizer ID:", organizerId);
            await this._eventService.deleteEvent(req.params.id, organizerId);
            res.status(204).send();
        } catch (err: any) {
            console.error("❌ Error in deleteEvent:", err);
            next(err);
        }
    };

    async getEventById(req: Request, res: Response, next: NextFunction): Promise<void> {
        console.log("🎯 getEventById called with ID:", req.params.id);
        try {
            const event = await this._eventService.getEventById(req.params.id);
            if (!event) {
                console.warn("⚠️ Event not found:", req.params.id);
                res.status(404).json({ error: 'Event not found' });
            }
            res.status(200).json(event);
        } catch (err: any) {
            console.error("❌ Error in getEventById:", err);
            next(err);
        }
    };

    async listEvents(req: Request, res: Response, next: NextFunction) {
        console.log("🎯 listEvents called");
        try {
            const events = await this._eventService.listEvents();
            res.status(200).json(events);
        } catch (err: any) {
            console.error("❌ Error in listEvents:", err);
            next(err);
        }
    };

    async listOrganizerEvents(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        console.log("🎯 listOrganizerEvents called");
        try {
            const organizerId = req.user!.id;
            console.log("Organizer ID:", organizerId);
            const events = await this._eventService.listEventsByOrganizer(organizerId);
            res.status(200).json(events);
        } catch (err: any) {
            console.error("❌ Error in listOrganizerEvents:", err);
            next(err);
        }
    };
}
