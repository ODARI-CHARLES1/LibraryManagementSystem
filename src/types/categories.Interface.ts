export interface Category {
  category_id: number;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CategoryInput {
  name: string;
  description?: string;
}

export interface CategoryUpdateInput {
  name?: string;
  description?: string;
}