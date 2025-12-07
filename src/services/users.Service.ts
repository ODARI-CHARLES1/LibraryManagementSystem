import { match } from 'assert'
import * as userRepository from '../repositories/user.Repository'
import { existingUser, newUser, TupdateUser, User } from '../types/users.types'
import getDate from '../Utils/generateDate.utils'
import hashPassword from '../Utils/hashPassword.utils'
import bcrypt from 'bcrypt'
import jwt, { Secret } from 'jsonwebtoken'

export const getAdmins=async()=>{
 const admins=await userRepository.getAdmins()
 admins.forEach(admin=>{
  delete admin?.password_hash
 })
 return admins
}

export const getAdminById=async(admin_id:number)=>{
    const admin=await userRepository.getAdminById(admin_id)
    delete admin?.password_hash
    return admin
}

export const getUsers=async()=>{
    const users=await userRepository.getUsers()
    users.forEach(user=>{
    delete user?.password_hash
    })
    return users
}
export const getMembers=async()=>{
    const members=await userRepository.getMembers()
    members.forEach(member=>{
       delete member?.password_hash
    })
    return members

}

export const getMemberId=async(member_id:number)=>{
    const member=await userRepository.getMemberId(member_id)
    delete member?.password_hash
    return member
}
export const getUserByEmail=async(user_email:string)=>{
    const user=await userRepository.getUserByEmail(user_email)
    delete user?.password_hash
    return user
}

export const insertUser=async(user:newUser)=>{
    try {
        const existingUser=await userRepository.getUserByEmail(user.email)
        if(!existingUser){
            const created=await getDate()
            const hashed= await hashPassword(user.password)
            user.created_at=new Date(created)
            user.password=hashed
            const registeredUser=await userRepository.insertUser(user)
            if(!registeredUser){
              return {success:false,message:"Failed to creaete new user"}
            }
            return {success:true,registeredUser}
        }
          return {success:false,Message:"User already exists"}
    } catch (error:any) {
        return {success:false,error:error.message}
    }
}

export const loginUser = async (userData: existingUser) => {
  try {
    const foundUser = await userRepository.loginUser(userData);

    if (!foundUser || foundUser.length === 0) {
      return { success: false, message: "User doesn't exist, signup" };
    }
    const storedHash = foundUser[0].password_hash;
    console.log(userData.password)
    console.log(foundUser)
    if (!userData.password || !storedHash) {
      return { success: false, message: "Missing password data" };
    }
    const matchPassword = await bcrypt.compare(userData.password, storedHash);
    if (!matchPassword) {
      return { success: false, message: "Wrong Password" };
    }

    const secret = process.env.JWT_SECRET as string;
    const payload = {
      id: foundUser[0].user_id,
      username: foundUser[0].username,
      role: foundUser[0].role,
      created: foundUser[0].created_at,
      updated: foundUser[0].updated_at,
      email:foundUser[0].email
    };

    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    if (!token) {
      return { success: false, message: "Try Again" };
    }

    const payloadWithToken = { ...payload, token };
    return { success: true, message: "Logged in successfully", data: payloadWithToken };

  } catch (error) {
    console.error("Error in loginUser:", error);
    throw error;
  }
};

export const deleteUser=async(user_id:number)=>{
   await userRepository.deleteUser(user_id)
}

export const updateUser=async(user:TupdateUser):Promise<User|null>=>{
  const verifyUser=await userRepository.getUserByEmail(user.email)
  if(!verifyUser){
    return null
  }
  const updatedUser=await userRepository.updateUser(user)
  return updatedUser
}
// export const deleteKey = (objectData: User[], key: string) => {
//   return objectData.map((data: any) => {
//     const newData = { ...data };
//     delete newData[key];
//     return newData;
//   });
// };
