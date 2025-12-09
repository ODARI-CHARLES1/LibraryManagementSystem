import * as Bookrepo from '../../src/repositories/books.Repository';
import * as bookService from '../../src/services/books.Service';
import { Book, BookInput, BookUpdateInput } from '../../src/types/books.Interface';

// Mock the repository
jest.mock('../../src/repositories/books.Repository');

describe('Book Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllBooks', () => {
    test('should return all books with filters', async () => {
      const mockBooks = [
        { book_id: 1, title: 'Book 1', author: 'Author 1', category_id: 1 },
        { book_id: 2, title: 'Book 2', author: 'Author 2', category_id: 2 }
      ];

      (Bookrepo.findAll as jest.Mock).mockResolvedValue(mockBooks);

      const filters = { title: 'Book', author: 'Author' };
      const result = await bookService.getAllBooks(filters);

      expect(Bookrepo.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockBooks);
    });
  });

  describe('getBookById', () => {
    test('should return book by ID', async () => {
      const mockBook = { book_id: 1, title: 'Book 1', author: 'Author 1' };

      (Bookrepo.findById as jest.Mock).mockResolvedValue(mockBook);

      const result = await bookService.getBookById(1);

      expect(Bookrepo.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockBook);
    });

    test('should return null when book not found', async () => {
      (Bookrepo.findById as jest.Mock).mockResolvedValue(null);

      const result = await bookService.getBookById(999);

      expect(Bookrepo.findById).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('createBook', () => {
    test('should create a valid book', async () => {
      const bookInput: BookInput = {
        title: 'New Book',
        author: 'New Author',
        category_id: 1,
        publication_year: 2023,
        stock_quantity: 5
      };

      const mockCreatedBook = { ...bookInput, book_id: 1 };

      (Bookrepo.categoryExists as jest.Mock).mockResolvedValue(true);
      (Bookrepo.create as jest.Mock).mockResolvedValue(mockCreatedBook);

      const result = await bookService.createBook(bookInput);

      expect(Bookrepo.categoryExists).toHaveBeenCalledWith(1);
      expect(Bookrepo.create).toHaveBeenCalledWith(
        'New Book', 'New Author', 1, 2023, 5
      );
      expect(result).toEqual(mockCreatedBook);
    });

    test('should throw error for missing title', async () => {
      const bookInput: BookInput = {
        title: '',
        author: 'Author',
        category_id: 1,
        publication_year: 2023,
        stock_quantity: 5
      };

      await expect(bookService.createBook(bookInput))
        .rejects.toThrow('Title and author are required');
    });

    test('should throw error for invalid publication year', async () => {
      const bookInput: BookInput = {
        title: 'Book',
        author: 'Author',
        category_id: 1,
        publication_year: 3000,
        stock_quantity: 5
      };

      await expect(bookService.createBook(bookInput))
        .rejects.toThrow('Invalid publication year');
    });

    test('should throw error for invalid category', async () => {
      const bookInput: BookInput = {
        title: 'Book',
        author: 'Author',
        category_id: 999,
        publication_year: 2023,
        stock_quantity: 5
      };

      (Bookrepo.categoryExists as jest.Mock).mockResolvedValue(false);

      await expect(bookService.createBook(bookInput))
        .rejects.toThrow('Invalid category_id');
    });
  });

  describe('updateBook', () => {
    test('should update a book successfully', async () => {
      const updateInput: BookUpdateInput = {
        title: 'Updated Title',
        author: 'Updated Author'
      };

      const mockUpdatedBook = {
        book_id: 1,
        title: 'Updated Title',
        author: 'Updated Author',
        category_id: 1
      };

      (Bookrepo.categoryExists as jest.Mock).mockResolvedValue(true);
      (Bookrepo.update as jest.Mock).mockResolvedValue(mockUpdatedBook);

      const result = await bookService.updateBook(1, updateInput);

      expect(Bookrepo.update).toHaveBeenCalledWith(
        1, 'Updated Title', 'Updated Author', undefined, undefined, undefined
      );
      expect(result).toEqual(mockUpdatedBook);
    });

    test('should throw error when no fields provided', async () => {
      const updateInput: BookUpdateInput = {};

      await expect(bookService.updateBook(1, updateInput))
        .rejects.toThrow('At least one field must be provided');
    });
  });

  describe('deleteBook', () => {
    test('should delete book successfully', async () => {
      (Bookrepo.countBorrowRecordsForBook as jest.Mock).mockResolvedValue(0);
      (Bookrepo.remove as jest.Mock).mockResolvedValue(true);

      const result = await bookService.deleteBook(1);

      expect(Bookrepo.countBorrowRecordsForBook).toHaveBeenCalledWith(1);
      expect(Bookrepo.remove).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    test('should throw error when book has active borrow records', async () => {
      (Bookrepo.countBorrowRecordsForBook as jest.Mock).mockResolvedValue(3);

      await expect(bookService.deleteBook(1))
        .rejects.toThrow('Cannot delete – book has active borrow records');
    });
  });
});