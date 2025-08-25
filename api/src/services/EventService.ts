import { IEvent, IEventDocument } from "../models/Event";
import { IEventRepository } from "../repositories/interfaces/IEventRepository";
import { CustomError } from "../utils/CustomError";
import { IEventService } from "./interfaces/IEventService";


export class EventService implements IEventService {
    private _eventRepo: IEventRepository;

    constructor(eventRepo: IEventRepository) {
        this._eventRepo = eventRepo;
    }

    async createEvent(data: Partial<IEvent>): Promise<IEventDocument> {
        return this._eventRepo.create(data);
    }

    async updateEvent(id: string, data: Partial<IEvent>, organizerId: string): Promise<IEventDocument | null> {
        const event = await this._eventRepo.findById(id);
        if (!event) throw new CustomError('Event not found',404);
        if (event.organizerId.toString() !== organizerId) throw new CustomError('Not authorized',401);
        return this._eventRepo.update(id, data);
    }

    async deleteEvent(id: string, organizerId: string): Promise<IEventDocument | null> {
        const event = await this._eventRepo.findById(id);
        if (!event) throw new CustomError('Event not found',404);
        if (event.organizerId.toString() !== organizerId) throw new CustomError('Not authorized',401);
        return this._eventRepo.delete(id);
    }

    async getEventById(id: string): Promise<IEventDocument | null> {
        return this._eventRepo.findById(id);
    }

    async listEvents(): Promise<IEventDocument[]> {
        return this._eventRepo.findAll();
    }

    async listEventsByOrganizer(organizerId: string): Promise<IEventDocument[]> {
        return this._eventRepo.findByOrganizer(organizerId);
    }
}