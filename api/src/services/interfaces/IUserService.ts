import { IUserDocumnet } from "../../models/User";

export interface IUserService{
    registerUser(data:{name:string,email:string,password:string,role:'organizer' | 'attendee'}):Promise<IUserDocumnet>;

    loginUser(email:string,password:string):Promise<{user:IUserDocumnet,token:string}>
    getUserById(id:String):Promise<IUserDocumnet | null>
}