# Library Management System

A comprehensive library management software built with Node.js, Express, and SQL Server. This system provides a RESTful API for managing library operations including user management, book cataloging, borrowing records, categories, and comments.

## Features

- **User Management**: Handle library members and administrators
- **Book Cataloging**: Manage library book inventory
- **Borrowing System**: Track book loans and returns
- **Categories**: Organize books by categories
- **Comments**: Allow users to comment on books
- **Authentication**: JWT-based authentication for secure access
- **RESTful API**: Clean and structured API endpoints
- **SQL Server Integration**: Robust database backend


## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: SQL Server (MSSQL)
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Development Tool**: tsx for hot reload
- **Authentication**: JWT (jsonwebtoken) with bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- SQL Server
- pnpm

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd library-management-system
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
    Create a `.env` file in the root directory with the following variables:
    ```
    SQL_SERVER=your-sql-server-host
    SQL_DB=your-database-name
    SQL_USER=your-username
    SQL_PWD=your-password
    SQL_PORT=your-sql-server-port
    JWT_SECRET=your-jwt-secret-key
    ```

4. Set up the database:
   Run the SQL script located at `src/config/librarymangement.sql` to create the necessary tables and schema.

## Usage

### Development

Run the development server with hot reload:
```bash
pnpm run dev
```

### Production

Build and start the production server:
```bash
pnpm run build
pnpm run start
```

The server will start on `http://localhost:3000`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header as a Bearer token for protected routes.

### Login

To authenticate, send a POST request to `/api/users/login` with user credentials. The response will include a JWT token that should be used for subsequent requests.

## API Endpoints

### Users
- `GET /api/users` - Get all users (Authenticated)
- `GET /api/users/admins` - Get all administrators (Authenticated)
- `GET /api/users/admin/:admin_id` - Get admin by ID (Authenticated)
- `GET /api/users/admin/` - Get user by email (Authenticated)
- `GET /api/users/members` - Get all members (Authenticated)
- `GET /api/users/member/:member_id` - Get member by ID (Authenticated)
- `POST /api/users/create` - Create a new user (Authenticated)
- `POST /api/users/login` - Login user
- `DELETE /api/users/delete/:id` - Delete a user (Authenticated)

### Books
- `GET /api/books` - Get all books (Authenticated)
- `GET /api/books/:id` - Get book by ID (Authenticated)
- `POST /api/books` - Create a new book (Authenticated)
- `PUT /api/books/:id` - Update a book (Authenticated)
- `DELETE /api/books/:id` - Delete a book (Authenticated)

### Borrow Records
- `GET /api/borrow-records` - Get all borrow records (Authenticated)
- `GET /api/borrow-records/:borrow_id` - Get borrow record by ID (Authenticated)
- `POST /api/borrow-records/create` - Create a new borrow record (Authenticated)
- `PUT /api/borrow-records/update/:borrow_id` - Update a borrow record (Authenticated)
- `PATCH /api/borrow-records/clear/:borrow_id` - Clear a borrow record (Authenticated)
- `DELETE /api/borrow-records/delete/:borrow_id` - Delete a borrow record (Authenticated)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create a new category (Authenticated)
- `PUT /api/categories/:id` - Update a category (Authenticated)
- `DELETE /api/categories/:id` - Delete a category (Authenticated)

### Comments
- `GET /api/comments` - Get all comments (Authenticated)
- `GET /api/comments/:id` - Get comment by ID (Authenticated)
- `POST /api/comments/create` - Create a new comment (Authenticated)
- `PUT /api/comments/:id` - Update a comment (Authenticated)
- `DELETE /api/comments/:id` - Delete a comment (Authenticated)

## Project Structure

```
src/
├── config/
│   ├── database.ts          # Database configuration
│   └── librarymangement.sql # Database schema
├── controllers/             # Route handlers
├── repositories/            # Data access layer
├── router/                  # API routes
├── services/                # Business logic
├── types/                   # TypeScript interfaces
├── Utils/                   # Utility functions
├── Middlewares/             # Authentication and validation middleware
└── index.ts                 # Application entry point
```

## Database Schema

The system uses SQL Server with the following main entities:
- Users (Members and Admins)
- Books
- Borrow Records
- Categories
- Comments

Entity Relationship Diagram:

![ERD](./images/ERD.png)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the ISC License.
