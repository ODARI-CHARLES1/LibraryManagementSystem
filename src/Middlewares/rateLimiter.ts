import { Request,Response,NextFunction } from "express";
import {RateLimiterMemory} from 'rate-limiter-flexible'

export const rateLimiter=new RateLimiterMemory({
    points:10, //10 request
    duration:60 //per 60 seconds
})

export const rateLimiterMiddleware=async(req:Request,res:Response,next:NextFunction)=>{
    try {
       await rateLimiter.consume(req.ip || 'unknwon');
       console.log(`Rate Limit check passed for IP ${req.ip}`)
       next()
    } catch (error) {
        console.log(`Rate Limit exceeded for IP:${req.ip} `)
        res.status(429).json({message:"Too many Request , please try again Later"})
    }
}