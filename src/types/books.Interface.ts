export interface Book {
  book_id: number;
  title: string;
  author: string;
  category_id: number | null;
  publication_year: number | null;
  stock_quantity: number;
  created_at: Date;
  updated_at: Date;
}

export interface BookInput {
  title: string;
  author: string;
  category_id?: number | null;
  publication_year?: number;
  stock_quantity: number;
}

export interface BookUpdateInput {
  title?: string;
  author?: string;
  category_id?: number | null;
  publication_year?: number;
  stock_quantity?: number;
}