import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string
): string => {
  return jwt.sign(payload, secret, { expiresIn: expireTime });
};
const verifyToken = (token: string, secrect: Secret): JwtPayload => {
  return jwt.verify(token, secrect) as JwtPayload;
};
export const jwtHelpers = {
  createToken,
  verifyToken,
};
