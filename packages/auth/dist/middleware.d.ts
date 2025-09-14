import { Request, Response, NextFunction } from "express";
interface CustomRequest extends Request {
    userId?: string;
    userRole?: "athlete" | "official";
}
export declare function auth(userType: "athlete" | "official"): (req: CustomRequest, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=middleware.d.ts.map