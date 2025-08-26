import { BaseRepository } from "./BaseRepository";
import User,{IUserDocument} from "../models/User";
import { IUserRepository } from "./interfaces/IUserRepository";

export class UserRepository extends BaseRepository<IUserDocument> implements IUserRepository{
    constructor(){
        super(User)
    }

    async findByEmail(email:string):Promise<IUserDocument | null>{
        return this.model.findOne({email})
    }
}