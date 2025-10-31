import * as CategoriesRepository from '../repositories/categories.Repository.js';
import { Category, CategoryInput, CategoryUpdateInput } from '../types/categories.Interface.js';

export const getAllCategories = async (): Promise<Category[]> => {
  return await CategoriesRepository.findAll();
};

export const getCategoryById = async (id: number): Promise<Category | null> => {
  return await CategoriesRepository.findById(id);
};

export const createCategory = async (input: CategoryInput): Promise<Category> => {
  const { name, description } = input;
  return await CategoriesRepository.create(name.trim(), description?.trim());
};

export const updateCategory = async (id: number, input: CategoryUpdateInput): Promise<Category | null> => {
  const { name, description } = input;
  return await CategoriesRepository.update(id, name?.trim(), description?.trim());
};

export const deleteCategory = async (id: number): Promise<boolean> => {
  // Optional: Check if category is used in Books before deletion
  const booksUsingCategory = await CategoriesRepository.countBooksInCategory(id);
  if (booksUsingCategory > 0) {
    throw new Error('Cannot delete category: books are assigned to it. Use ON DELETE SET NULL in DB.');
  }
  return await CategoriesRepository.remove(id);
};