import { Router } from 'express';
import * as BookController from '../controllers/books.Controllers';  
import { isAuthenticated } from '../Middlewares/bearAuth';
import { authorize } from '../Middlewares/roleAuth';
//import { authenticateJWT } from '../middleware/auth';
//import { authorizeRole } from '../middleware/role';

const router = Router();

router.get('/',isAuthenticated,BookController.getAllBooks);
router.get('/:id',isAuthenticated, BookController.getBookById);

//odari take note of these routes below to be protected, in admin role
router.post('/',isAuthenticated,authorize("admin"),BookController.createBook);
router.put('/:id',isAuthenticated,authorize("admin"),BookController.updateBook);
router.delete('/:id',isAuthenticated,authorize("admin"),BookController.deleteBook);

export default router;