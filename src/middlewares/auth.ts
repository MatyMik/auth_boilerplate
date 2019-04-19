import config from 'config';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { compare } from 'bcrypt';
import { ContextualRequest } from '../types';
import { Context, User } from '../types';
import { AuthorizationError } from '../utils/errors';

export const authUserByUsernameAndPassword = async (context: Context, username: string, password: string): Promise<User> => {
  const user = await context.models.user.findByUsername(username);
  if (!user) throw new AuthorizationError('Unknown user');
  if (user.disabled) throw new AuthorizationError('Disabled user');
  if (!user.password || user.suspended) throw new AuthorizationError('Suspended user');
  const match = await compare(Buffer.from(password, 'base64').toString(), user.password);
  if (!match) throw new AuthorizationError('Invalid password');
  delete user.password;
  return user;
};

export const authUserById = async (context: Context, userId: string): Promise<User> => {
  const user = await context.models.user.findById(userId);
  if (!user) throw new AuthorizationError();
  if (user.disabled) throw new AuthorizationError('Disabled user');
  if (!user.password || user.suspended) throw new AuthorizationError('Suspended user');
  delete user.password;
  return user;
};

passport.use(
  'user-local',
  new LocalStrategy(
    {
      passReqToCallback: true,
      usernameField: 'username',
      passwordField: 'password'
    },
    async (req: ContextualRequest, username, password, done) => {
      try {
        const user = await authUserByUsernameAndPassword(req.context, username, password);
        req.context.user = user;
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  'user-jwt',
  new JwtStrategy(
    {
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('jwt'),
        req => req.cookies['jwt'] || null
      ]),
      secretOrKey: config.get('auth.jwtSecret')
    },
    async (req: ContextualRequest, { userId }: any, done: VerifiedCallback) => {
      try {
        const user = await authUserById(req.context, userId);
        req.context.user = user;
        done(null, user || false);
      } catch (error) {
        done(error);
      }
    }
  )
);


export default (who: 'user', type: 'jwt' | 'local' = 'jwt') =>
  passport.authenticate(`${who}-${type}`, { session: false });
