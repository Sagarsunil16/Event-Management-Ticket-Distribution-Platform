import { IUser, IUserDocument } from "../../models/User";

export interface IUserService{
    registerUser(data:{name:string,email:string,password:string,role:'organizer' | 'attendee'}):Promise<IUserDocument>;
    loginUser(email:string,password:string):Promise<{user:IUserDocument,token:string}>
    getUserById(id:String):Promise<IUserDocument | null>
    updateProfile(updateData:Partial<IUser>,userId:string):Promise<IUserDocument | null>
}