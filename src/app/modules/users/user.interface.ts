import { Model } from 'mongoose';

export type IUser = {
  id?: string;
  name: string;
  email: string;
  role: string;
  password: string;
};

// instance method interface
// export type IUserMethods = {
//   isUserExist(id: string): Promise<Partial<IUser> | null>;
//   isPasswordMatched(
//     givenPasword: string,
//     savedPassword: string
//   ): Promise<boolean>;
// };

//  statics method interface
export type IStaticsMethods = {
  isUserExist(
    id: string
  ): Promise<Pick<IUser, 'id' | 'role' | 'password'> | null>;

  isPasswordMatched(
    givenPasword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;
export type UserModel = Model<IUser, Record<string, unknown>, IStaticsMethods>;
