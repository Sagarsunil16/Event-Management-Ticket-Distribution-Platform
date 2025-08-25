import { IEvent, IEventDocument } from "../models/Event";
import { IEventRepository } from "../repositories/interfaces/IEventRepository";
import { IEventService } from "./interfaces/IEventService";


export class EventService implements IEventService {
    private eventRepo: IEventRepository;

    constructor(eventRepo: IEventRepository) {
        this.eventRepo = eventRepo;
    }

    async createEvent(data: Partial<IEvent>): Promise<IEventDocument> {
        return this.eventRepo.create(data);
    }

    async updateEvent(id: string, data: Partial<IEvent>, organizerId: string): Promise<IEventDocument | null> {
        const event = await this.eventRepo.findById(id);
        if (!event) throw new Error('Event not found');
        if (event.organizerId.toString() !== organizerId) throw new Error('Not authorized');
        return this.eventRepo.update(id, data);
    }

    async deleteEvent(id: string, organizerId: string): Promise<IEventDocument | null> {
        const event = await this.eventRepo.findById(id);
        if (!event) throw new Error('Event not found');
        if (event.organizerId.toString() !== organizerId) throw new Error('Not authorized');
        return this.eventRepo.delete(id);
    }

    async getEventById(id: string): Promise<IEventDocument | null> {
        return this.eventRepo.findById(id);
    }

    async listEvents(): Promise<IEventDocument[]> {
        return this.eventRepo.findAll();
    }

    async listEventsByOrganizer(organizerId: string): Promise<IEventDocument[]> {
        return this.eventRepo.findByOrganizer(organizerId);
    }
}