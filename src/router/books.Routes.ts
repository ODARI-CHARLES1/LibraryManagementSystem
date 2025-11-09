import { Router } from 'express';
import * as BookController from '../controllers/books.Controllers.js';  
import { isAuthenticated } from '../Middlewares/bearAuth.js';
import { authorize } from '../Middlewares/roleAuth.js';
//import { authenticateJWT } from '../middleware/auth';
//import { authorizeRole } from '../middleware/role';

const router = Router();

router.get('/',isAuthenticated,BookController.getAllBooks);
router.get('/:id',isAuthenticated, BookController.getBookById);

//odari take note of these routes below to be protected, in admin role
router.post('/',authorize,isAuthenticated,BookController.createBook);
router.put('/:id',isAuthenticated,authorize,BookController.updateBook);
router.delete('/:id',isAuthenticated,authorize,BookController.deleteBook);

export default router;