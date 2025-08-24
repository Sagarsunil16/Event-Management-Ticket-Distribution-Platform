import { IBaseRepository } from "../BaseRepository";
import { IUserDocumnet } from "../../models/User";


export interface IUserRepository extends IBaseRepository<IUserDocumnet>{
    findByEmail(email:String):Promise<IUserDocumnet | null>
}