import config from "config";
import passport from "passport";
import { Strategy } from "passport-local";
import { ContextualRequest } from "../types";
import { PermissionError, AuthorizationError } from "../utils/errors";
import { User } from "../models/User";

passport.use(
  new Strategy(
    {
      usernameField: "email",
      passReqToCallback: true,
      session: true,
    },
    async (req: ContextualRequest, email: string, password: string, done) => {
      const userService = req.context.userService;
      try {
        const user = await userService.findOneByEmail(email);
        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        const userValidated = await userService.validatePassword(
          password,
          user.password
        );
        if (!userValidated) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser(function (user: User, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (
  req: ContextualRequest,
  id: string,
  done
) {
  try {
    const user = await req.context.userService.findOneById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport.authenticate("contract-jwt", { session: false });
