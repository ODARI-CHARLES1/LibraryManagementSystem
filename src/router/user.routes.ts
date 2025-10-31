import { Router } from "express";
import * as userController from '../controllers/users.Controllers'
import { validateLoginUser, validateUser } from "../Middlewares/userValidate";
const userRouter=Router()

userRouter.get("/users",userController.getUsers)
userRouter.get("/users/admins",userController.getAdmins)
userRouter.get("/users/admin/:admin_id",userController.getAdminById)
userRouter.get("/users/admin/",userController.getUserByEmail)
userRouter.get("/users/members",userController.getMembers)
userRouter.get("/users/member/:member_id",userController.getMemberById)
userRouter.post("/users/create",validateUser,userController.createUser)
userRouter.delete("/users/delete/:id",userController.deleteUser)
userRouter.post("/users/login",validateLoginUser,userController.userlogin)


export default userRouter