
import { getpool } from '../config/database'; 

import { Comment, NewComment, UpdateComment } from '../types/comments.Interface'; 


export const getAllComments = async (): Promise<Comment[]> => {
    const pool = await getpool();
    
    const result = await pool.request().query('SELECT * FROM Comments');
    
    return result.recordset as Comment[];
};

export const getCommentById = async (id: number): Promise<Comment | undefined> => {
    const pool = await getpool();
    const result = await pool
        .request()
        .input('id', id)
        
        .query('SELECT * FROM Comments WHERE comment_id = @id');
    
    
    return result.recordset[0] as Comment | undefined;
};



export const createComment = async (comment: NewComment) => {
    const pool = await getpool();
    await pool
        .request()
        .input('user_id', comment.user_id)
        .input('book_id', comment.book_id)
        .input('rating', comment.rating)
        .input('comment', comment.comment)
        
        .query(`
            INSERT INTO Comments (user_id, book_id, rating, comment) 
            VALUES (@user_id, @book_id, @rating, @comment)
        `);
   
    return { message: 'Comment created successfully' };
}


 

export const updateComment = async (id: number, comment: UpdateComment) => {
    const pool = await getpool();
    await pool
        .request()
        // ... inputs for id, rating, comment ...
        .query(`
            UPDATE Comments 
            SET 
                rating = ISNULL(@rating, rating),  -- Use provided @rating, otherwise keep current 'rating'
                comment = ISNULL(@comment, comment) -- Use provided @comment, otherwise keep current 'comment'
            WHERE comment_id = @id
        `);
    return { message: 'Comment updated successfully' };
};

export const deleteComment = async (id: number) => {
    const pool = await getpool();
    await pool
        .request()
        .input('id', id)
        .query('DELETE FROM Comments WHERE comment_id = @id');
    return { message: 'Comment deleted successfully' };
};