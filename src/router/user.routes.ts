import { Router } from "express";
import * as userController from '../controllers/users.Controllers'
import { validateLoginUser, validateUser } from "../Middlewares/userValidate";
import { isAuthenticated } from "../Middlewares/bearAuth";
import { authorize } from "../Middlewares/roleAuth";


const userRouter=Router()


userRouter.post("/users/login", validateLoginUser, userController.userlogin); 
userRouter.post("/users/create", validateUser, userController.createUser); 
userRouter.put("/users/update/:id",isAuthenticated,authorize("admin"),userController.updateUser)
userRouter.get("/users", isAuthenticated,authorize("admin"), userController.getUsers); 
userRouter.get("/users/admins", isAuthenticated, authorize("admin"), userController.getAdmins)
userRouter.get("/users/admin/:admin_id", isAuthenticated, authorize("admin"), userController.getAdminById);
userRouter.get("/users/admin/", isAuthenticated, authorize("admin"), userController.getUserByEmail);
userRouter.get("/users/members", isAuthenticated, authorize("admin"), userController.getMembers); 
userRouter.get("/users/member/:member_id", isAuthenticated, authorize("admin"), userController.getMemberById);
userRouter.delete("/users/delete/:id", isAuthenticated, authorize("admin"), userController.deleteUser);

export default userRouter