import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import {Request,Response,NextFunction} from 'express'
dotenv.config()


export const authorize= (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !user.role) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (user.role.toLowerCase() !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden: Admins only' });
    }


    next(); 
};
