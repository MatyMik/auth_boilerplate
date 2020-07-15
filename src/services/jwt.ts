import config from 'config';
import jwt from 'jsonwebtoken';

const secret: string = config.get('auth.jwtSecret');
const authTokenExpiration: string = config.get('auth.authTokenExpiration');

export const createToken = (hash: string): Promise<string> => {
  return new Promise((resolve, reject) =>
    jwt.sign({ hash }, secret, { expiresIn: authTokenExpiration }, (err, token) =>
      err ? reject(err) : resolve(token)
    )
  );
};

export const resolveToken = (token: string): Promise<number> => {
  return new Promise((resolve, reject) =>
    jwt.verify(token, secret, (err) =>
      err ? reject(err) : resolve()
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

export const resolveRefreshToken = (token: string): Promise<number> => {
  return new Promise((resolve, reject) =>
    jwt.verify(token, secret, (err) =>
      err ? reject(err) : resolve()
    )
  );
};