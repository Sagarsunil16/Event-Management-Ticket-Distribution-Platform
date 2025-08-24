import {Schema, model, Document, Types} from 'mongoose'

export interface IEvent{
    title: string;
    description: string;
    organizerId: Types.ObjectId;
    date: Date;
    venue: string;
    category: string;
    totalTickets: number;
    ticketsSold: number;
}

export interface IEventDocument extends IEvent , Document{}

const EventSchema = new Schema<IEventDocument>({
    title: { type: String, required: true },
        description: { type: String, required: true },
        organizerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        date: { type: Date, required: true },
        venue: { type: String, required: true },
        category: { type: String, required: true },
        totalTickets: { type: Number, required: true, min: 1 },
        ticketsSold: { type: Number, default: 0 },
    },
    { timestamps: true }
)

export default model<IEventDocument>("Event",EventSchema);