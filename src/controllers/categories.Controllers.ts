import { Request, Response } from 'express';
import * as CategoriesService from '../services/categories.Service.js';
import { CategoryInput, CategoryUpdateInput } from '../types/categories.Interface.js';

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await CategoriesService.getAllCategories();
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
};

export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid category ID' });
      return;
    }

    const category = await CategoriesService.getCategoryById(id);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.status(200).json(category);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving category', error: error.message });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const input: CategoryInput = req.body;

    // Validation
    if (!input.name || input.name.trim().length === 0) {
      res.status(400).json({ message: 'Category name is required' });
      return;
    }

    const category = await CategoriesService.createCategory(input);
    res.status(201).json(category);
  } catch (error: any) {
    if (error.message.includes('UNIQUE')) {
      res.status(409).json({ message: 'Category name already exists' });
    } else {
      res.status(500).json({ message: 'Failed to create category', error: error.message });
    }
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid category ID' });
      return;
    }

    const input: CategoryUpdateInput = req.body;
    if (!input.name && !input.description) {
      res.status(400).json({ message: 'At least one field (name or description) is required' });
      return;
    }

    const updatedCategory = await CategoriesService.updateCategory(id, input);
    if (!updatedCategory) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.status(200).json(updatedCategory);
  } catch (error: any) {
    if (error.message.includes('UNIQUE')) {
      res.status(409).json({ message: 'Category name already exists' });
    } else {
      res.status(500).json({ message: 'Failed to update category', error: error.message });
    }
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid category ID' });
      return;
    }

    const success = await CategoriesService.deleteCategory(id);
    if (!success) {
      res.status(404).json({ message: 'Category not found or cannot be deleted (in use)' });
      return;
    }

    res.status(204).send(); // No content
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete category', error: error.message });
  }
};