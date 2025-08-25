import { IEvent, IEventDocument } from "../../models/Event";

export interface IEventService {
    createEvent(data: Partial<IEvent>): Promise<IEventDocument>;
    updateEvent(id: string, data: Partial<IEvent>, organizerId: string): Promise<IEventDocument | null>;
    deleteEvent(id: string, organizerId: string): Promise<IEventDocument | null>;
    getEventById(id: string): Promise<IEventDocument | null>;
    listEvents(): Promise<IEventDocument[]>;
    listEventsByOrganizer(organizerId: string): Promise<IEventDocument[]>;
}