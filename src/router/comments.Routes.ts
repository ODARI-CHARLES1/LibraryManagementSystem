

import { Router } from "express";
import * as commentController from '../controllers/comments.Controllers';


const router = Router();

// Define your routes here
router.post('/comments/create', commentController.createComment);
router.get('/comments', commentController.getAllComments);
router.get('/comments/:id', commentController.getCommentById);
router.put('/comments/:id', commentController.updateComment);
router.delete('/comments/:id', commentController.deleteComment);
export default router;


