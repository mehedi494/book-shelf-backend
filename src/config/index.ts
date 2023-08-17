import dotenv from 'dotenv';
import Path from 'path';
dotenv.config({ path: Path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,

  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUNDS,
  jwt: {
    accessTokon_secret: process.env.JWT_SECRET,
    refreshToken_secret: process.env.JWT_REFRESH_SECRET,
    accessTokon_secret_expires: process.env.JWT_EXPIRES_IN,
    refreshToken_secret_expires: process.env.JWT_REFRESH_EXPIRES_IN,
  },
};
