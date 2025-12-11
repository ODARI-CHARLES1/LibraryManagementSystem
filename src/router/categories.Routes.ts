import { Router } from 'express';
import * as CategoryController from '../controllers/categories.Controllers';
import { isAuthenticated } from '../Middlewares/bearAuth';
import { authorize } from '../Middlewares/roleAuth';
const router = Router();

router.get('/',CategoryController.getAllCategories);
router.get('/:id',CategoryController.getCategoryById);
router.post('/',isAuthenticated,authorize("admin"),CategoryController.createCategory);
router.put('/:id',isAuthenticated,authorize("admin"),CategoryController.updateCategory);
router.delete('/:id',isAuthenticated,authorize("admin"),CategoryController.deleteCategory);

export default router;