import { Router } from "express";
import * as borrowController from "../controllers/borrowrecords.Controllers"
import { isAuthenticated } from "../Middlewares/bearAuth";
import { authorize } from "../Middlewares/roleAuth";

const borrowRouter = Router(); 
borrowRouter.get("/borrow-records", isAuthenticated,authorize("admin"),borrowController.getAllBorrowRecords);
borrowRouter.get("/borrow-records/:borrow_id", isAuthenticated,borrowController.getBorrowRecordById);
borrowRouter.post("/borrow-records/create", isAuthenticated,authorize("admin"),borrowController.createBorrowRecord);
borrowRouter.put("/borrow-records/update/:borrow_id", isAuthenticated,authorize("admin"),borrowController.updateBorrowRecord);
borrowRouter.patch("/borrow-records/clear/:borrow_id", isAuthenticated,authorize("admin"),borrowController.clearBorrowRecord);
borrowRouter.delete("/borrow-records/delete/:borrow_id", isAuthenticated,authorize("admin"),borrowController.deleteBorrowRecord);

export default borrowRouter;
