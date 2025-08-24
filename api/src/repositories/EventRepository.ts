import Event, { IEventDocument } from "../models/Event";
import { BaseRepository } from "./BaseRepository";
import { IEventRepository } from "./interfaces/IEventRepository";

export class EventRepository extends BaseRepository<IEventDocument> implements IEventRepository{
    constructor(){
        super(Event)
    }

    async findByOrganizer(organizerId: string): Promise<IEventDocument[]> {
        return this.model.find({organizerId}).sort({date:1})
    }
}