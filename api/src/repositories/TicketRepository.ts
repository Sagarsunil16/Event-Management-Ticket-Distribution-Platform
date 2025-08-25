
import Ticket, { ITicketDocument } from "../models/Ticket";
import { BaseRepository } from "./BaseRepository";
import { ITicketRepository } from "./interfaces/ITicketRepository";

export class TicketRepository extends BaseRepository<ITicketDocument> implements ITicketRepository{
    constructor(){
        super(Ticket)
    }

    async findByAttendee(attendeeId: string): Promise<ITicketDocument[] | null> {
        return this.model.find({attendeeId})
    }
    async findByEventAndAttendee(eventId: string, attendeeId: string): Promise<ITicketDocument | null> {
        return this.model.findOne({eventId,attendeeId,status:"active"})
    }
}