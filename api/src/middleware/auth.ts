import { NextFunction,Request,Response } from 'express'
import jwt from 'jsonwebtoken'


interface jwtPayload{
    id:string,
    role:string,
    iat:number,
    exp:number
}

export interface AuthRequest<T = any, P = any> extends Request<P, any, T> {
    user?:jwtPayload
}

export const authenticateJWT = (req:AuthRequest,res:Response,next:NextFunction)=>{
    const authHeader =  req.headers.authorization

     if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const secret = process.env.JWT_SECRET || 'JWT_SECRET';

        const decoded = jwt.verify(token, secret) as jwtPayload;

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
}