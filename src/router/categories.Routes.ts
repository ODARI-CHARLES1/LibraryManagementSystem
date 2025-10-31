import { Router } from 'express';
import * as CategoryController from '../controllers/categories.Controllers.js';
//import { authenticateJWT } from '../middleware/auth';
//import { authorizeRole } from '../middleware/role';

const router = Router();

// Public routes
router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategoryById);
// Admin-only routes to be protected | example - router.delete('/:id', authenticateJWT, authorizeRole('Admin'), CategoriesController.deleteCategory);

router.post('/',CategoryController.createCategory);
router.put('/:id',CategoryController.updateCategory);
router.delete('/:id',CategoryController.deleteCategory);

export default router;