import mongoose from "mongoose";
import { ITicketDocument } from "../models/Ticket";
import { IEventRepository } from "../repositories/interfaces/IEventRepository";
import { ITicketRepository } from "../repositories/interfaces/ITicketRepository";
import { CustomError } from "../utils/CustomError";
import { ITicketService } from "./interfaces/ITicketService";

export class TicketService implements ITicketService{
    private _ticketRepo: ITicketRepository
    private _eventRepo: IEventRepository
    constructor(ticketRepo:ITicketRepository, eventRepo:IEventRepository){
        this._ticketRepo = ticketRepo;
        this._eventRepo = eventRepo
    }

    async bookTicket(eventId: string, attendeeId: string): Promise<ITicketDocument> {
        const existing = await this._ticketRepo.findByEventAndAttendee(eventId,attendeeId);
        if(existing) throw new CustomError('Already booked for this event',400)

        const event = await this._eventRepo.findById(eventId);
        if(!event) throw new CustomError("Event not found",404);

        if(event.ticketsSold >= event.totalTickets) throw new CustomError("Sold out",400)

        const ticket = await this._ticketRepo.create({attendeeId:new mongoose.Types.ObjectId(attendeeId),eventId:new mongoose.Types.ObjectId(eventId),status: 'active',bookingDate: new Date()
        });
        event.ticketsSold += 1;
        await event.save();
        return ticket;
    }

    async cancelTicket(ticketId: string, attendeeId: string): Promise<ITicketDocument | null> {
        const ticket = await this._ticketRepo.findById(ticketId);
        if(!ticket) throw new CustomError("Ticket not found",404);

        if(ticket.attendeeId.toString() !== attendeeId) throw new CustomError('Not Authorized',402);
        if(ticket.status === 'cancelled') throw new CustomError('Ticket already cancelled',400);
        ticket.status = 'cancelled';
        await ticket.save()

        // Decrement sold tickets  
        const event = await this._eventRepo.findById(ticket.eventId.toString());
        if(event && event.ticketsSold > 0){
            event.ticketsSold-=1;
            await event.save();
        }
        return ticket;
    }

    async listUserTickets(attendeeId: string): Promise<ITicketDocument[] | null> {
        return this._ticketRepo.findByAttendee(attendeeId);
    }

}