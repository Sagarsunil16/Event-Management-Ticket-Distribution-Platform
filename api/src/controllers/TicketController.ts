import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { ITicketService } from "../services/interfaces/ITicketService";

export class TicketController{
    private _ticketService:ITicketService
    constructor(ticketService:ITicketService){
        this._ticketService = ticketService
    }

    async book(req:AuthRequest,res:Response,next:NextFunction):Promise<void>{
         try {
            const attendeeId = req.user!.id;
            const { eventId } = req.body;
            const ticket = await this._ticketService.bookTicket(eventId, attendeeId);
            res.status(201).json(ticket);
        } catch (err:any) {
            next(err)
        }
    }

    async cancel(req:AuthRequest,res:Response,next:NextFunction):Promise<void>{
        try {
            const attendeeId = req.user!.id;
            const { ticketId } = req.body;
            const ticket = await this._ticketService.cancelTicket(ticketId, attendeeId);
            res.status(200).json(ticket);
        } catch (err:any) {
            next(err)
        }
    }

    async myTickets(req:AuthRequest,res:Response,next:NextFunction):Promise<void>{
        try {
            const attendeeId = req.user!.id;
            const tickets = await this._ticketService.listUserTickets(attendeeId);
            res.status(200).json(tickets);
        } catch (err:any) {
            next(err)
        }
    };
}
