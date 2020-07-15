import config from 'config';
import passport from 'passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { ContextualRequest } from '../types';
import { PermissionError, AuthorizationError } from '../utils/errors';

passport.use(
  'contract-jwt',
  new Strategy(
    {
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('x-contract-token'),
        req => req.cookies['x-contract-token'] || null
      ]),
      secretOrKey: config.get('auth.jwtSecret'),
      ignoreExpiration: true
    },
    async (req: ContextualRequest, { hash }: { hash: string }, done: VerifiedCallback) => {
      try {
        const token = req.headers.authorization.replace('Bearer ','');
        if (!token) throw new AuthorizationError();
        await req.context.jwt.resolveToken(token).catch(() => { throw new PermissionError() });
        const contract = await req.context.models.contract.findByHashAndToken(hash, token);
        if (!contract) throw new PermissionError();
        done(null, contract);
      } catch (error) {
        done(error);
      }
    }
  )
);

export default passport.authenticate("contract-jwt", { session: false });
