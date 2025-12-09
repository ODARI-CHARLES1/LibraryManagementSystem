import { Router } from 'express';
import * as CategoryController from '../controllers/categories.Controllers.js';
import { isAuthenticated } from '../Middlewares/bearAuth.js';
import { authorize } from '../Middlewares/bearAuth.js';
//import { authenticateJWT } from '../middleware/auth';
//import { authorizeRole } from '../middleware/role';

const router = Router();

// Public routes
router.get('/',CategoryController.getAllCategories);
router.get('/:id',CategoryController.getCategoryById);
// Admin-only routes to be protected | example - router.delete('/:id', authenticateJWT, authorizeRole('Admin'), CategoriesController.deleteCategory);

router.post('/',isAuthenticated,authorize,CategoryController.createCategory);
router.put('/:id',isAuthenticated,authorize,CategoryController.updateCategory);
router.delete('/:id',isAuthenticated,authorize,CategoryController.deleteCategory);

export default router;