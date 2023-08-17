import { IUser } from './user.interface';
import { User } from './user.model';

const userCreate = async (data: IUser) => {
  if (!data.role) {
    data.role = 'user';
  }
  const res = await User.create(data);
  return res;
};

export const UserService = {
  userCreate,
};
