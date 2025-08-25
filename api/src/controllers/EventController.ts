import { NextFunction, Request, Response } from 'express';
import { IEventService } from '../services/interfaces/IEventService';
import { AuthRequest } from '../middleware/auth';

export class EventController {
    private eventService: IEventService;

    constructor(eventService: IEventService) {
        this.eventService = eventService;
    }

    createEvent = async (req: AuthRequest, res: Response, next:NextFunction) => {
        try {
            const organizerId = req.user!.id;
            const event = await this.eventService.createEvent({ ...req.body, organizerId });
            res.status(201).json(event);
        } catch (err: any) {
            next(err)
        }
    };

    updateEvent = async (req: AuthRequest, res: Response, next:NextFunction) => {
        try {
            const organizerId = req.user!.id;
            const event = await this.eventService.updateEvent(req.params.id, req.body, organizerId);
            res.status(200).json(event);
        } catch (err: any) {
            next(err)
        }
    };

    deleteEvent = async (req: AuthRequest, res: Response, next:NextFunction) => {
        try {
            const organizerId = req.user!.id;
            await this.eventService.deleteEvent(req.params.id, organizerId);
            res.status(204).send();
        } catch (err: any) {
            next(err)
        }
    };

    getEventById = async (req: Request, res: Response, next:NextFunction) => {
        try {
            const event = await this.eventService.getEventById(req.params.id);
            if (!event) return res.status(404).json({ error: 'Event not found' });
            res.status(200).json(event);
        } catch (err: any) {
            next(err)
        }
    };

    listEvents = async (req: Request, res: Response, next:NextFunction) => {
        try {
            console.log("HIIII")
            const events = await this.eventService.listEvents();
            res.status(200).json(events);
        } catch (err: any) {
            next(err)
        }
    };

    listOrganizerEvents = async (req: AuthRequest, res: Response, next:NextFunction) => {
        try {
            const organizerId = req.user!.id;
            const events = await this.eventService.listEventsByOrganizer(organizerId);
            res.status(200).json(events);
        } catch (err: any) {
            next(err)
        }
    };
}
