import { ITicketDocument } from "../../models/Ticket";
import { IBaseRepository } from "../BaseRepository";

export interface ITicketRepository extends IBaseRepository<ITicketDocument>{
    findByAttendee(attendeeId:string):Promise<ITicketDocument[] | null>
    findByEventAndAttendee(eventId:string,attendeeId:string):Promise<ITicketDocument | null>
}