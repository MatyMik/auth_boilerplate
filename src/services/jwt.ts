import config from 'config';
import jwt from 'jsonwebtoken';
import { AuthorizationError, PermissionError } from '../utils/errors';
import { ObjectID } from 'bson';

export type VerificationInfo = {
  email: string;
  payload?: any;
};

const secret: string = config.get('auth.jwtSecret');
const authTokenExpiration: string = config.get('auth.authTokenExpiration');
const verificationTokenExpiration: string = config.get('auth.verificationTokenExpiration');

export const createAuthToken = (id: string | ObjectID ): Promise<string> => {
  const userId = typeof id === "string" ? new ObjectID(id) : id;
  return new Promise((resolve, reject) =>
    jwt.sign({ userId }, secret, { expiresIn: authTokenExpiration }, (err, token) =>
      err ? reject(err) : resolve(token)
    )
  );
};

export const resolveAuthToken = (token: string): Promise<number> => {
  return new Promise((resolve, reject) =>
    jwt.verify(token, secret, (err, payload: { userId: number }) =>
      err ? reject(new AuthorizationError()) : resolve(payload.userId)
    )
  );
};

export const createVerificationToken = (email: string, payload?: any): Promise<string> => {
  return new Promise((resolve, reject) =>
    jwt.sign({ email, payload }, secret, { expiresIn: verificationTokenExpiration }, (err, token) =>
      err ? reject(err) : resolve(token)
    )
  );
};

export const resolveVerificationToken = (token: string): Promise<VerificationInfo> => {
  return new Promise((resolve, reject) =>
    jwt.verify(token, secret, (err, payload: VerificationInfo) =>
      err ? reject(new PermissionError('Invalid token')) : resolve(payload)
    )
  );
};

export const createConfirmationToken = (userId: number): Promise<string> => {
  return new Promise((resolve, reject) =>
    jwt.sign({ userId }, secret, { expiresIn: authTokenExpiration }, (err, token) =>
      err ? reject(err) : resolve(token)
    )
  );
};

export const resolveConfirmationToken = (token: string): Promise<number> => {
  return new Promise((resolve, reject) =>
    jwt.verify(token, secret, (err, { userId }: { userId: number }) =>
      err ? reject(new PermissionError('Invalid token')) : resolve(userId)
    )
  );
};

export const createRefreshToken = (hash: string): Promise<string> => {
  return new Promise((resolve, reject) =>
    jwt.sign({ hash }, secret, { expiresIn: '1h' }, (err, token) =>
      err ? reject(err) : resolve(token)
    )
  );
};

