import httpStatus from 'http-status';
import ApiError from '../../../errors/apiError';
import { IUser, iLogin } from './user.interface';
import { User } from './user.model';
import { jwtHelpers } from '../../../helper/jwtHelper';
import config from '../../../config';
import { JwtPayload, Secret } from 'jsonwebtoken';

const userCreate = async (data: IUser) => {
  if (!data.role) {
    data.role = 'user';
  }

  const res = await User.create(data);

  return res;
};

const loginUser = async (payload: iLogin) => {
  const { email: mail, password } = payload;

  const userExist = await User.isUserExist(mail);
  if (!userExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'user not found');
  }
  if (
    userExist.password &&
    !(await User.isPasswordMatched(password, userExist.password))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'incorrect password');
  }
  const { _id, email, role } = userExist;

  const accessToken = jwtHelpers.createToken(
    { _id, email, role },
    config.jwt.accessTokon_secret as Secret,
    config.jwt.accessTokon_secret_expires as string
  );
  const refreshToken = jwtHelpers.createToken(
    { _id, email, role },
    config.jwt.refreshToken_secret as Secret,
    config?.jwt?.refreshToken_secret_expires as string
  );

  return {
    accessToken,
    refreshToken,
  };
};
const getUser = async (accesstoken: string): Promise<Partial<IUser>> => {
  // eslint-disable-next-line no-console

  const verifieToken = jwtHelpers.verifyToken(
    accesstoken as string,
    config.jwt.accessTokon_secret as Secret
  ) as JwtPayload;

  const user = await User.findOne({ email: verifieToken.email }).select({
    password: 0,
    __v: 0,
  });

  // const { ...result}= user
  if (!user) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'unauthorized please log in again'
    );
  }
  return user;
};

export const UserService = {
  userCreate,
  loginUser,
  getUser,
};
