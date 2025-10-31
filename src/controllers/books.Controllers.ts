import { Request, Response } from 'express';
import * as BookService from '../services/books.Service.js';
import { BookInput, BookUpdateInput } from '../types/books.Interface.js';

export const getAllBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters = {
      title: req.query.title as string | undefined,
      author: req.query.author as string | undefined,
      category_id: req.query.category_id
        ? parseInt(req.query.category_id as string)
        : undefined,
    };

    const books = await BookService.getAllBooks(filters);
    res.status(200).json(books);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch books', error: error.message });
  }
};

export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid book ID' });
      return;
    }

    const book = await BookService.getBookById(id);
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }

    res.status(200).json(book);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving book', error: error.message });
  }
};

export const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const input: BookInput = req.body;

    // Basic required fields
    if (!input.title?.trim() || !input.author?.trim()) {
      res.status(400).json({ message: 'Title and author are required' });
      return;
    }

    if (input.stock_quantity < 0) {
      res.status(400).json({ message: 'Stock quantity cannot be negative' });
      return;
    }

    const book = await BookService.createBook(input);
    res.status(201).json(book);
  } catch (error: any) {
    if (error.message.includes('Invalid category_id')) {
      res.status(400).json({ message: error.message });
    } else if (error.message.includes('UNIQUE')) {
      res.status(409).json({ message: 'Book with this title and author already exists' });
    } else {
      res.status(500).json({ message: 'Failed to create book', error: error.message });
    }
  }
};

export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid book ID' });
      return;
    }

    const input: BookUpdateInput = req.body;
    if (Object.keys(input).length === 0) {
      res.status(400).json({ message: 'At least one field is required to update' });
      return;
    }

    if (input.stock_quantity !== undefined && input.stock_quantity < 0) {
      res.status(400).json({ message: 'Stock quantity cannot be negative' });
      return;
    }

    const updatedBook = await BookService.updateBook(id, input);
    if (!updatedBook) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }

    res.status(200).json(updatedBook);
  } catch (error: any) {
    if (error.message.includes('Invalid category_id')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to update book', error: error.message });
    }
  }
};

export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid book ID' });
      return;
    }

    const success = await BookService.deleteBook(id);
    if (!success) {
      res.status(404).json({ message: 'Book not found or cannot be deleted (active borrows)' });
      return;
    }

    res.status(204).send(); // No content
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete book', error: error.message });
  }
};