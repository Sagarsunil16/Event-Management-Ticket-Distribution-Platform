import { IEventDocument } from "../../models/Event";
import { IBaseRepository } from "../BaseRepository";


export interface IEventRepository extends IBaseRepository<IEventDocument>{
    findByOrganizer(organzierId:string):Promise<IEventDocument[]>
}