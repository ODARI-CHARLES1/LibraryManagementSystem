
export interface Comment {
    comment_id: number;
    user_id: number;
    book_id: number;
    rating: number;
    comment: string | null; 
    created_at: Date; 
}


export interface NewComment {
    user_id: number;
    book_id: number;
    rating: number;
    comment: string | null;
}


export interface UpdateComment {
    rating?: number;
    comment?: string | null;
}