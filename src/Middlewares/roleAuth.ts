import { Request, Response, NextFunction } from "express";

// Reusable role-based authorization middleware
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(user.role.toLowerCase())) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }

    next();
  };
};
