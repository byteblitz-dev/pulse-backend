"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = auth;
const passport_1 = __importDefault(require("./passport"));
function auth(userType) {
    const strategy = userType === "athlete" ? "athlete-jwt" : "official-jwt";
    return function (req, res, next) {
        passport_1.default.authenticate(strategy, { session: false }, function (err, user, _info) {
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
