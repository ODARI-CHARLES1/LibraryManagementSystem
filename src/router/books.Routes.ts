import { Router } from 'express';
import * as BookController from '../controllers/books.Controllers.js';  
//import { authenticateJWT } from '../middleware/auth';
//import { authorizeRole } from '../middleware/role';

const router = Router();

router.get('/', BookController.getAllBooks);
router.get('/:id', BookController.getBookById);
//odari take note of these routes below to be protected, in admin role
router.post('/',BookController.createBook);
router.put('/:id',BookController.updateBook);
router.delete('/:id',BookController.deleteBook);

export default router;