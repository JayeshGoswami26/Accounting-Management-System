import { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    user?: {
        _id: string;
        username: string;
        email: string;
        role: "admin" | "staff" | "manager" | "accountant";
        name: string;
    };
}
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const authorize: (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const canViewInternalData: (role: string) => boolean;
export declare const canEditSettings: (role: string) => boolean;
export declare const canDeleteData: (role: string) => boolean;
export declare const canManageUsers: (role: string) => boolean;
//# sourceMappingURL=auth.d.ts.map