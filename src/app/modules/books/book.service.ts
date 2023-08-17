import { SortOrder } from 'mongoose';
import { IGenericResponse } from '../../../interface/common';
import { IPaginationOptions } from '../../../interface/paginationOption';
import { paginationHelpers } from '../../../shared/paginationHelper';
import { booksSearchableFields } from './book.constant';
import { IBookFilters, IBooks } from './book.interface';
import { Book } from './book.model';
import { JwtPayload, Secret } from 'jsonwebtoken';
import { jwtHelpers } from '../../../helper/jwtHelper';
import config from '../../../config';
import { User } from '../users/user.model';
import ApiError from '../../../errors/apiError';
import httpStatus from 'http-status';

const getAllbooks = async (
  filters: IBookFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IBooks[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: booksSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([filed, value]) => ({
        [filed]: value,
      })),
    });
  }

  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortCondition: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  const whereConditon = andConditions.length > 0 ? { $and: andConditions } : {};
  const result = await Book.find(whereConditon)
    .skip(skip)
    .limit(limit)
    .sort(sortCondition);
  const total = result.length;
  console.log(result);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const addNewBook = async (accesstoken: string, payload: IBooks) => {
  const verifieToken = jwtHelpers.verifyToken(
    accesstoken,
    config.jwt.accessTokon_secret as Secret
  ) as JwtPayload;

  const isUserExist = await User.isUserExist(verifieToken.email);
  console.log(isUserExist);
  if (!isUserExist) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'unauthorized please log in again'
    );
  }

  payload.userId = isUserExist._id as string;
  if (
    payload.author &&
    payload.genre &&
    payload.image &&
    payload.publication_date &&
    payload.title &&
    payload.userId
  ) {
    console.log(payload);
    const result = await Book.create(payload);
    return result;
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Book all properties are required'
    );
  }
};

const deletBook = async (accesstoken: string, id: string) => {
  const verifieToken = jwtHelpers.verifyToken(
    accesstoken,
    config.jwt.accessTokon_secret as Secret
  ) as JwtPayload;

  const isUserExist = await User.isUserExist(verifieToken.email);

  if (!isUserExist) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'unauthorized please log in again'
    );
  }
  console.log('Bookid', id);
  const book = await Book.findById(id);
  console.log('book', book);
  console.log('book.userId', book?.userId);
  console.log('verifieToken', verifieToken);

  if (!book?.userId) {
    throw new ApiError(httpStatus.BAD_GATEWAY, 'UserId not found');
  }

  if (verifieToken._id !== book?.userId.toString()) {
    console.log('if book.userId', book?.userId);
    console.log('if verifieToken', verifieToken._id);
    throw new ApiError(httpStatus.BAD_REQUEST, 'you are unauthorized');
  } else {
    return await Book.deleteOne({ _id: id });
  }
};

export const BookService = {
  getAllbooks,
  addNewBook,
  deletBook,
};
