

import { Request, Response } from 'express';
import * as commentServices from '../services/comments.Service';

const handleServiceErrors = (res: Response, error: any) => {
    
    if (error.message.includes('Invalid') || error.message.includes('Rating must')) {
        res.status(400).json({ message: error.message });
    } else if (error.message.includes('Comment not found')) {
        res.status(404).json({ message: error.message });
    } else {
        
        res.status(500).json({ error: 'Internal server error' });
    }
}


export const getAllComments = async (req: Request, res: Response) => {
    try {
        console.log(req.body)
        const comments = await commentServices.listComments();
        res.status(200).json(comments);
    } catch (error: any) {
        handleServiceErrors(res, error);
    }
}


export const getCommentById = async (req: Request, res: Response) => {
    
    const id = parseInt(req.params.id); 
    try {
        const comment = await commentServices.getComment(id);
        res.status(200).json(comment);
    } catch (error: any) {
        handleServiceErrors(res, error);
    }
}


export const createComment = async (req: Request, res: Response) => {
    try {
        const comment=req.body
        console.log(comment)
        const result = await commentServices.createComment(req.body);
        res.status(201).json(result); 
    } catch (error: any) {
        handleServiceErrors(res,error)
    }
}


export const updateComment = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const commentUpdate = req.body;
    try {
        const result = await commentServices.updateComment(id, commentUpdate);
        res.status(200).json(result); 
    } catch (error: any) {
        handleServiceErrors(res, error);
    }
}


export const deleteComment = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const result = await commentServices.deleteComment(id);
        res.status(200).json(result); 
    } catch (error: any) {
        handleServiceErrors(res, error);
    }
}