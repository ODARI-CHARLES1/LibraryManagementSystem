import { Request, Response } from "express";
import * as userServices from "../services/users.Service";
import hashPassword from "../Utils/hashPassword.utils";
import getDate from "../Utils/generateDate.utils";
import { validateEmail } from "../Utils/validateEmail.utils";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userServices.getUsers();

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
};

export const getAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await userServices.getAdmins();

    if (!admins || admins.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No admins found",
      });
    }

    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
};

export const getMembers = async (req: Request, res: Response) => {
  try {
    const members = await userServices.getMembers();

    if (!members || members.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No members found",
      });
    }

    res.status(200).json({
      success: true,
      data: members,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
};

export const getAdminById = async (req: Request, res: Response) => {
  try {
    const adminId = Number(req.params.admin_id);

    if (isNaN(adminId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin ID",
      });
    }

    const admin = await userServices.getAdminById(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: `Admin with ID ${adminId} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
};

export const getMemberById = async (req: Request, res: Response) => {
  try {
    const memberId = Number(req.params.member_id);

    if (isNaN(memberId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid member ID",
      });
    }

    const member = await userServices.getMemberId(memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: `Member with ID ${memberId} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
      const userData=req.body
      const newUser = await userServices.insertUser(userData);
      if(newUser?.success==false){
        res.status(400).json({success:false,message:newUser.Message})
      }
      else{
          res.status(201).json({
        success: true,
        message: "User created successfully",
        newUser:newUser.registerUser
      });
      }
    
    }
   catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id)
    
     console.log(userId)
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    await userServices.deleteUser(userId);

    res.status(200).json({
      success: true,
      message: `User with ID ${userId} deleted successfully`,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const userEmail = req.query.user_email as string;
    if (!userEmail || userEmail.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid user email",
      });
    }

    const user = await userServices.getUserByEmail(userEmail);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with email '${userEmail}' does not exist`,
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error("Error fetching user by email:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
};


export const userlogin=async(req:Request,res:Response)=>{
  try {
    const user=req.body
   const loginUser=await userServices.loginUser(user)
   res.status(201).json(loginUser)
  } catch (error:any) {
     console.log("Error to login",error)
     return res.status(500).json({
      success:false,
      error:error.message || "Internal Server Error"
     })
  }
}