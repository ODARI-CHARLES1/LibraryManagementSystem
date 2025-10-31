import * as Bookrepo from '../repositories/books.Repository.js';
import { Book, BookInput, BookUpdateInput } from '../types/books.Interface.js';

export const getAllBooks = async (filters: {
  title?: string;
  author?: string;
  category_id?: number;
}): Promise<Book[]> => {
  return Bookrepo.findAll(filters);
};

export const getBookById = async (id: number): Promise<Book | null> => {
  return Bookrepo.findById(id);
};

export const createBook = async (input: BookInput): Promise<Book> => {
  const { title, author, category_id, publication_year, stock_quantity } = input;
  if (!title?.trim() || !author?.trim()) {
    throw new Error('Title and author are required');
  }
  if (publication_year && (publication_year <= 0 || publication_year > new Date().getFullYear())) {
    throw new Error('Invalid publication year');
  }
  if (stock_quantity < 0) {
    throw new Error('Stock quantity must be non-negative');
  }
  if (category_id !== undefined && category_id !== null) {
    const categoryExists = await Bookrepo.categoryExists(category_id);
    if (!categoryExists) {
      throw new Error('Invalid category_id');
    }
  }
  return Bookrepo.create(title.trim(), author.trim(), category_id ?? null, publication_year, stock_quantity);
};

export const updateBook = async (
  id: number,
  input: BookUpdateInput
): Promise<Book | null> => {
  const { title, author, category_id, publication_year, stock_quantity } = input;
  if (Object.keys(input).length === 0) {
    throw new Error('At least one field must be provided');
  }
  if (title !== undefined && !title.trim()) {
    throw new Error('Title cannot be empty');
  }
  if (author !== undefined && !author.trim()) {
    throw new Error('Author cannot be empty');
  }
  if (publication_year && (publication_year <= 0 || publication_year > new Date().getFullYear())) {
    throw new Error('Invalid publication year');
  }
  if (stock_quantity !== undefined && stock_quantity < 0) {
    throw new Error('Stock quantity must be non-negative');
  }
  if (category_id !== undefined && category_id !== null) {
    const categoryExists = await Bookrepo.categoryExists(category_id);
    if (!categoryExists) {
      throw new Error('Invalid category_id');
    }
  }
  return Bookrepo.update(id, title?.trim(), author?.trim(), category_id, publication_year, stock_quantity);
};

export const deleteBook = async (id: number): Promise<boolean> => {
  const inUse = await Bookrepo.countBorrowRecordsForBook(id);
  if (inUse > 0) {
    throw new Error('Cannot delete – book has active borrow records');
  }
  return Bookrepo.remove(id);
};