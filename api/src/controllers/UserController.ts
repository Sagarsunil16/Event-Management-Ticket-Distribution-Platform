import { NextFunction, Request, Response } from "express";
import { IUserService } from "../services/interfaces/IUserService";
import { CustomError } from "../utils/CustomError";
import { AuthRequest } from "../middleware/auth";
import { IUser } from "../models/User";

export class UserController{
    private _userService:IUserService
    
    constructor(userService:IUserService){
        this._userService = userService
    }

    async register(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const user = await this._userService.registerUser(req.body);
            res.status(201).json({user});
        } catch (err:any) {
            next(err)
        }
    }

    async login(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const {email,password} = req.body
            const {user,token} = await this._userService.loginUser(email,password)
            res.status(200).json({user,token})
        } catch (err:any) {
            next(err)
        }
    }

    async getProfile(req:AuthRequest,res:Response,next:NextFunction):Promise<void>{
        try {
            const userId = req.user?.id
            const user = await this._userService.getUserById(userId as string);
            if(!user) throw new CustomError('Not Found',404)
            
            res.status(200).json({user})
        } catch (err:any) {
            next(err)
        }
    }

    async updateProfile(req:AuthRequest,res:Response,next:NextFunction):Promise<void>{
        try {
            const userId = req.user?.id
            const updatedUser = await this._userService.updateProfile(req.body,userId as string)
            res.status(200).json({ message: 'Profile updated successfully', user: updatedUser })
        } catch (err:any) {
            next(err)
        }
    }
}


