


import * as commentRepositories from '../repositories/comment.Repository';
import { Comment, NewComment, UpdateComment } from '../types/comments.Interface';


const ensureCommentExists = async (id: number): Promise<Comment> => {
    const comment = await commentRepositories.getCommentById(id);
    if (!comment) {
      
        throw new Error('Comment not found'); 
    }
    return comment;
}


const validateId = (id: number, type: string) => {
    if (isNaN(id) || id <= 0) {
        
        throw new Error('Invalid  ID'); 
    }
}


export const listComments = async () => {
    return await commentRepositories.getAllComments();
}


export const getComment = async (id: number): Promise<Comment> => {
    validateId(id, 'comment'); 
    return await ensureCommentExists(id); 
}


export const createComment = async (comment: NewComment) => {
    return await commentRepositories.createComment(comment);
}


export const updateComment = async (id: number, commentUpdate: UpdateComment) => {
    validateId(id, 'comment');

  
    const existingComment = await ensureCommentExists(id);

   
    if (!existingComment) {
        throw new Error('commentUpdate not found')
    }
    
   
    return await commentRepositories.updateComment(id, commentUpdate);
}

export const deleteComment = async (id: number) => {
    validateId(id, 'comment');
    
    await ensureCommentExists(id); 
    return await commentRepositories.deleteComment(id);
}