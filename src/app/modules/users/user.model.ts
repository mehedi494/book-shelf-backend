/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { IUser, IStaticsMethods } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';

// instance method er jonno ;
/* const userSchema = new Schema<IUser,Record<string,known>, UserModel >({}) */

// statics method er jonno
const userSchema = new Schema<IUser, IStaticsMethods>(
  {
    id: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

/* ...... Instance method.......... */
// ...........Check Existing User
// userSchema.methods.isUserExist = async function (
//   id: string
// ): Promise<Partial<IUser> | null> {
//   return await User.findOne(
//     { id },
//     { id: 1, password: 1, needsPasswordChange: 1 }
//   );
// };

// ........Checking Password matching

// userSchema.methods.isPasswordMatched = async function (
//   givenPasword: string,
//   savedPassword: string
// ): Promise<boolean> {
//   return await bcrypt.compare(givenPasword, savedPassword);
// };

/* ...... statics method.......... */

userSchema.statics.isUserExist = async function (
  id: string
): Promise<Partial<Pick<IUser, 'id' | 'password'>> | null> {
  return await User.findOne(
    { id },
    { id: 1, password: 1, role: 1, needsPasswordChange: 1 }
  );
};
userSchema.statics.isPasswordMatched = async function (
  givenPasword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPasword, savedPassword);
};

// pre for hashPassword
userSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_round)
  );

  next();
});

// instance method
/* export const User = model<IUser,UserModel>('User', userSchema); */
export const User = model<IUser, IStaticsMethods>('User', userSchema);
