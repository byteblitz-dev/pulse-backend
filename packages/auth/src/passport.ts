import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";
import { prisma } from "@repo/db/client";
import { JWT_SECRET } from "./config";

passport.use(
  "athlete-local",
  new LocalStrategy(
    { usernameField: "email" },
    async (email: string, password: string, done) => {
      try {
        const user = await prisma.athlete.findUnique({ where: { email } });
        if (!user) return done(null, false, { message: "Incorrect username" });

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return done(null, false, { message: "Incorrect password" });

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.use(
  "official-local",
  new LocalStrategy(
    { usernameField: "email" },
    async (email: string, password: string, done) => {
      try {
        const user = await prisma.official.findUnique({ where: { email } });
        if (!user) return done(null, false, { message: "Incorrect username" });

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return done(null, false, { message: "Incorrect password" });

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

interface JWTPayload {
  sub: string;
}

passport.use(
  "athlete-jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET
    },
    async (payload: JWTPayload, done) => {
      try {
        const user = await prisma.athlete.findUnique({ where: { id: payload.sub } });
        if (user) return done(null, user);
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.use(
  "official-jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET
    },
    async (payload: JWTPayload, done) => {
      try {
        const user = await prisma.official.findUnique({ where: { id: payload.sub } });
        if (user) return done(null, user);
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

export default passport;
