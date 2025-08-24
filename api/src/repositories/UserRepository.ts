import { BaseRepository } from "./BaseRepository";
import User,{IUserDocumnet} from "../models/User";
import { IUserRepository } from "./interfaces/IUserRepository";

export class UserRepository extends BaseRepository<IUserDocumnet> implements IUserRepository{
    constructor(){
        super(User)
    }

    async findByEmail(email:string):Promise<IUserDocumnet | null>{
        return this.model.findOne({email})
    }
}