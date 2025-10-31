import { match } from 'assert'
import * as userRepository from '../repositories/user.Repository'
import { existingUser, newUser, User } from '../types/users.types'
import getDate from '../Utils/generateDate.utils'
import hashPassword from '../Utils/hashPassword.utils'
import bcrypt from 'bcrypt'
import jwt, { Secret } from 'jsonwebtoken'

export const getAdmins=async()=>{
 const admins=await userRepository.getAdmins()
 return admins
}

export const getAdminById=async(admin_id:number)=>{
    const admin=await userRepository.getAdminById(admin_id)
    return admin
}

export const getUsers=async()=>{
    const users=await userRepository.getUsers()
    return users
}
export const getMembers=async()=>{
    const members=await userRepository.getMembers()
    return members
}

export const getMemberId=async(member_id:number)=>{
    const member=await userRepository.getMemberId(member_id)
    return member
}
export const getUserByEmail=async(user_email:string)=>{
    const users=await userRepository.getUserByEmail(user_email)
    return users
}

export const insertUser=async(user:newUser)=>{
    try {
        const existingUser=await userRepository.getUserByEmail(user.email)
        if(!existingUser){
            const created=await getDate()
            const hashed= await hashPassword(user.password)
            user.created_at=new Date(created)
            user.password=hashed
            const registerUser=await userRepository.insertUser(user)
            return {registerUser}
        }
        else{
            return {success:false,Message:"User already exists"}
        }   
    } catch (error:any) {
        return {success:false,error:error.message}
    }
}

export const loginUser=async(user:existingUser)=>{
    try {
        const existingUser=await userRepository.loginUser(user)
        if(!existingUser){
            return {success:false,message:"User doesn't exist, signup"}
        }
        const matchPassword=bcrypt.compare(user.password,existingUser[0].password)
        if(!matchPassword){
            return {success:false,message:"Wrong Password"}
        }
        const secret=process.env.JWT_SECRET  as string
        const expires=process.env.JWT_EXPIRES as string
        const payload={
            id:existingUser[0].user_id,
            username:existingUser[0].username,
            role:existingUser[0].role,
            created:existingUser[0].created_at,
            updated:existingUser[0].updated_at
        } 
        const token=jwt.sign(payload,secret,{expiresIn:'1h'})

        if(!token){
            return {success:false,messaeg:"Try Again"}
        }
        const payloadWithToken={...payload,token}
        return {success:true,message:"Logged in successfully",data:payloadWithToken}

    } catch (error) {
        throw error
    }
}
export const deleteUser=async(user_id:number)=>{
   await userRepository.deleteUser(user_id)
}