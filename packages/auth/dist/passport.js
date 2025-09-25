"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@repo/db/client");
const config_1 = require("./config");
passport_1.default.use("athlete-local", new passport_local_1.Strategy({ usernameField: "email" }, async (email, password, done) => {
    try {
        const user = await client_1.prisma.athlete.findUnique({ where: { email } });
        if (!user)
            return done(null, false, { message: "Incorrect username" });
        const isValid = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isValid)
            return done(null, false, { message: "Incorrect password" });
        return done(null, user);
    }
    catch (err) {
        return done(err, false);
    }
}));
passport_1.default.use("official-local", new passport_local_1.Strategy({ usernameField: "email" }, async (email, password, done) => {
    try {
        const user = await client_1.prisma.official.findUnique({ where: { email } });
        if (!user)
            return done(null, false, { message: "Incorrect username" });
        const isValid = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isValid)
            return done(null, false, { message: "Incorrect password" });
        return done(null, user);
    }
    catch (err) {
        return done(err, false);
    }
}));
passport_1.default.use("athlete-jwt", new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config_1.JWT_SECRET
}, async (payload, done) => {
    try {
        const user = await client_1.prisma.athlete.findUnique({ where: { id: payload.sub } });
        if (user)
            return done(null, user);
        return done(null, false);
    }
    catch (err) {
        return done(err, false);
    }
}));
passport_1.default.use("official-jwt", new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config_1.JWT_SECRET
}, async (payload, done) => {
    try {
        const user = await client_1.prisma.official.findUnique({ where: { id: payload.sub } });
        if (user)
            return done(null, user);
        return done(null, false);
    }
    catch (err) {
        return done(err, false);
    }
}));
exports.default = passport_1.default;
