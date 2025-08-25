import { Schema, model, Document, Types } from "mongoose";

export interface ITicket{
    attendeeId: Types.ObjectId;
    eventId: Types.ObjectId;
    bookingDate: Date;
    status: 'active' | 'cancelled';
}

export interface ITicketDocument extends ITicket, Document{}

const TicketSchema = new Schema<ITicketDocument>({
    attendeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    bookingDate: { type: Date, required: true, default: Date.now },
    status: { type: String, enum: ['active', 'cancelled'], required: true, default: 'active' }
})

export default model<ITicketDocument>("Ticket",TicketSchema);