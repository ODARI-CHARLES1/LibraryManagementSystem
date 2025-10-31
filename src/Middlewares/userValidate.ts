import { Request,Response,NextFunction } from "express";
import { validateEmail } from "../Utils/validateEmail.utils";


export const validateUser=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const userData=req.body
        let missingFields:string[]=[]
        let invalidFields:string[]=[]
        let details:string[]=[]
        let invalids:string[]=[]
        if(!userData || Object.keys(userData).length==0){
            res.status(400).json({success:false,message:"Provide user data"})
        }
        if(!userData.username)missingFields.push("username") 
        if(!userData.email)missingFields.push("email")
        if(!userData.password)missingFields.push("passoword")
        if(missingFields.length>0){
            res.status(400).json({success:false,message:{
                error:"Provide User",
                Details:missingFields
            }})
        }
        else{
            if(!validateEmail(userData.email)){
                invalidFields.push("email")
                res.status(400).json({success:false,message:{
                    error:"Provide valid Details",
                    details:invalids
                }})
            }
            else{
                missingFields=[]
                details=[]
                invalids=[]

                next()
            }
        }
    } catch (error:any) {
        console.log("Validation Error")
        res.status(500).json({success:false,message:"Validation Error"+ error.message})
    }
}

export const validateLoginUser=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        let missingFields:string[]=[]
        let invalidFields:string[]=[]
        let invalids:string[]=[]
        const user=req.body
         if(!user || Object.keys(user).length==0){
            res.status(400).json({success:false,message:"Provide user data"})
        }
        if(!user.email)missingFields.push("email")
        if(!user.password)missingFields.push("passoword")
              if(missingFields.length>0){
            res.status(400).json({success:false,message:{
                error:"Provide User Details",
                Details:missingFields
            }})
        }
        else{
            if(!validateEmail(user.email)){
                invalidFields.push("email")
                res.status(400).json({success:false,message:{
                    error:"Provide valid Details",
                    details:invalids
                }})
            }
            else{
                missingFields=[]
                invalids=[]
                next()
            }
        }

        

    } catch (error) {
         console.log("Validation Error")
        res.status(500).json({success:false,message:"Validation Error"})
    }
}