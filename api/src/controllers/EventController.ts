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
        try {
            const organizerId = req.user!.id;
            const { id } = req.params;
            const event = await this._eventService.updateEvent(id, req.body, organizerId);
            res.status(200).json(event);
        } catch (err: any) {
            next(err);
        }
    };

    async deleteEvent(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const organizerId = req.user!.id;
           const { id } = req.params;
            await this._eventService.deleteEvent(id, organizerId);
            res.status(204).send();
        } catch (err: any) {
            next(err);
        }
    };

    async getEventById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const event = await this._eventService.getEventById(id);
            if (!event) {
                res.status(404).json({ error: 'Event not found' });
            }
            res.status(200).json(event);
        } catch (err: any) {
            next(err);
        }
    };

    async listEvents(req: Request, res: Response, next: NextFunction) {
        try {
            const events = await this._eventService.listEvents();
            res.status(200).json(events);
        } catch (err: any) {
            next(err);
        }
    };

    async listOrganizerEvents(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const organizerId = req.user!.id;
            const events = await this._eventService.listEventsByOrganizer(organizerId);
            res.status(200).json(events);
        } catch (err: any) {
            next(err);
        }
    };
}
