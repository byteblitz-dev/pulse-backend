// packages/auth/src/middleware.ts
import { Request, Response, NextFunction } from "express";
import passport from "./passport";
import type { Athlete, Official } from "@prisma/client";

interface CustomRequest extends Request {
  userId?: string;
  userRole?: "athlete" | "official";
}

export function auth(userType: "athlete" | "official") {
  const strategy = userType === "athlete" ? "athlete-jwt" : "official-jwt";

  return function (req: CustomRequest, res: Response, next: NextFunction) {
    passport.authenticate(strategy, { session: false }, function (
      err: Error | null,
      user: Athlete | Official | false,
      _info: any
    ) {
      if (err || !user) {
        return res
          .status(401)
          .json({ message: "Unauthorized: Invalid or missing token" });
      }

      req.userId = user.id;
      req.userRole = userType;
      next();
    })(req, res, next);
  };
}
