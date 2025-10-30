CREATE DATABASE LibraryManagement;

 USE LibraryManagement;
 --store user information as per their respective roles, either member(the student/staff) or admin(the librarian)
 CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) NOT NULL UNIQUE,
    email NVARCHAR(100) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL, -- Store hashed passwords (e.g., bcrypt output)
    role NVARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Member')),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);
--store book categories, will help in filter of books easily in frontend
CREATE TABLE Categories (
    category_id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(50) NOT NULL UNIQUE,
    description NVARCHAR(200),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);
--store book details, with the category present, but can be NULL too
CREATE TABLE Books (
    book_id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(100) NOT NULL,
    author NVARCHAR(100) NOT NULL,
    category_id INT, -- Nullable for uncategorized books
    publication_year INT CHECK (publication_year > 0 AND publication_year <= YEAR(GETDATE())),
    stock_quantity INT NOT NULL CHECK (stock_quantity >= 0),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (category_id) REFERENCES Categories(category_id) ON DELETE SET NULL
);
--track borrowing of books from the member, 
CREATE TABLE BorrowRecords (
    borrow_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    borrow_date DATETIME2 NOT NULL DEFAULT GETDATE(),
    due_date DATETIME2 NOT NULL,
    return_date DATETIME2, -- Null until returned
    status NVARCHAR(20) NOT NULL CHECK (status IN ('Borrowed', 'Overdue', 'Returned')),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES Books(book_id) ON DELETE CASCADE
);
--store book reviews and comments
CREATE TABLE Comments (
    comment_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment NVARCHAR(500),
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES Books(book_id) ON DELETE CASCADE
);

-- Create Indexes for Performance
CREATE INDEX idx_books_title_author ON Books(title, author);
CREATE INDEX idx_borrowrecords_user_id ON BorrowRecords(user_id);
CREATE INDEX idx_borrowrecords_book_id ON BorrowRecords(book_id);
CREATE INDEX idx_borrowrecords_status ON BorrowRecords(status);

-- Insert Initial Data

-- Insert Categories
INSERT INTO Categories (name, description) VALUES
('Fiction', 'Fictional literature'),
('Non-Fiction', 'Factual and informative books'),
('Science', 'Books on scientific topics');

SELECT * FROM Categories;

-- Insert Users (password hashes are placeholders; in practice, use hashed passwords)
INSERT INTO Users (username, email, password_hash, role) VALUES
('admin', 'admin@library.com', 'hashed_password_admin', 'Admin'),
('member1', 'member1@library.com', 'hashed_password_member1', 'Member'),
('member2', 'member2@library.com', 'hashed_password_member2', 'Member');

SELECT * FROM Users;

-- Insert Books
INSERT INTO Books (title, author, category_id, publication_year, stock_quantity) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', (SELECT category_id FROM Categories WHERE name = 'Fiction'), 1925, 5),
('Sapiens', 'Yuval Noah Harari', (SELECT category_id FROM Categories WHERE name = 'Non-Fiction'), 2011, 3),
('A Brief History of Time', 'Stephen Hawking', (SELECT category_id FROM Categories WHERE name = 'Science'), 1988, 2);

SELECT * FROM Books;

-- Insert Sample Borrow Record
INSERT INTO BorrowRecords (user_id, book_id, borrow_date, due_date, status) VALUES
((SELECT user_id FROM Users WHERE username = 'member1'),
 (SELECT book_id FROM Books WHERE title = 'The Great Gatsby'),
 GETDATE(),
 DATEADD(DAY, 14, GETDATE()),
 'Borrowed');

 SELECT * FROM BorrowRecords;

-- Insert Sample Comment
INSERT INTO Comments (user_id, book_id, rating, comment) VALUES
((SELECT user_id FROM Users WHERE username = 'member1'),
 (SELECT book_id FROM Books WHERE title = 'Sapiens'),
 4,
 'Very insightful book!');

 insert into comments VALUEs(3,1,3,'Very Informative','2025-10-26T19:54:44.220Z')

 SELECT * FROM Comments;
