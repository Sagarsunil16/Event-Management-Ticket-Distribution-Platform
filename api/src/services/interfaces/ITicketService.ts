import { ITicketDocument } from "../../models/Ticket";

export interface ITicketService{
     bookTicket(eventId: string, attendeeId: string): Promise<ITicketDocument>
     cancelTicket(ticketId: string, attendeeId: string): Promise<ITicketDocument | null>
     listUserTickets(attendeeId: string):Promise<ITicketDocument[] | null>
}