import { IBaseRepository } from "../BaseRepository";
import { IUserDocument } from "../../models/User";


export interface IUserRepository extends IBaseRepository<IUserDocument>{
    findByEmail(email:String):Promise<IUserDocument | null>
}