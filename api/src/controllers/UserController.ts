import { NextFunction, Request, Response } from "express";
import { IUserService } from "../services/interfaces/IUserService";
import { CustomError } from "../utils/CustomError";

export class UserController{
    private userService:IUserService
    
    constructor(userService:IUserService){
        this.userService = userService
    }

    async register(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const user = await this.userService.registerUser(req.body);
            res.status(201).json({user});
        } catch (error:any) {
            next(error)
        }
    }

    async login(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const {email,password} = req.body
            const {user,token} = await this.userService.loginUser(email,password)
            res.status(200).json({user,token})
        } catch (error) {
            next(error)
        }
    }

    async getProfile(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const user = await this.userService.getUserById(req.params.id);
            if(!user) throw new CustomError('Not Found',404)
            
            res.status(200).json({user})
        } catch (error) {
            next(error)
        }
    }
}


