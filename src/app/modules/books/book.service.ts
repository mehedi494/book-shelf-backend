import { IGenericResponse } from '../../../interface/common';
import { booksSearchableFields } from './book.constant';
import { IBookFilters, IBooks, ICommentPayload } from './book.interface';
import { Book } from './book.model';
import { JwtPayload, Secret } from 'jsonwebtoken';
import { jwtHelpers } from '../../../helper/jwtHelper';
import config from '../../../config';
import { User } from '../users/user.model';
import ApiError from '../../../errors/apiError';
import httpStatus from 'http-status';
import { paginationHelpers } from '../../../shared/paginationHelper';
import { IPaginationOptions } from '../../../interface/paginationOption';
import { SortOrder } from 'mongoose';

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

  const { page, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortCondition: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  const whereConditon = andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Book.find(whereConditon).sort(sortCondition);

  /*   .skip(skip)
    .limit(limit)
   ; */
  const total = result.length;

  return {
    meta: {
      page,
      total,
    },
    data: result,
  };
};
const getSingleBook = async (id: string): Promise<IBooks | null> => {
  const result = await Book.findById(id);
  return result;
};

const addNewBook = async (accesstoken: string, payload: IBooks) => {
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

  payload.userId = isUserExist._id as string;
  if (
    payload.author &&
    payload.genre &&
    payload.image &&
    payload.publication_date &&
    payload.title &&
    payload.userId
  ) {
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

  const book = await Book.findById(id);
  if (!book?.userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserId not found');
  }

  if (verifieToken._id !== book?.userId.toString()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'you are unauthorized');
  } else {
    return await Book.deleteOne({ _id: id });
  }
};

const updateBook = async (accesstoken: string, payload: Partial<IBooks>) => {
  const verifieToken = jwtHelpers.verifyToken(
    accesstoken,
    config.jwt.accessTokon_secret as Secret
  ) as JwtPayload;

  const isUserExist = await User.isUserExist(verifieToken.email);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const book = await Book.findOne({ _id: payload._id });

  if (!book?.userId) {
    throw new ApiError(
      httpStatus.BAD_GATEWAY,
      'no books found with this userId'
    );
  }

  if (verifieToken._id !== book?.userId.toString()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'you are unauthorized');
  }

  const update = {
    $set: {
      title: payload.title,
      author: payload.author,
      genre: payload.genre,
      image: payload.image,
      publication_date: payload.publication_date,
    },
  };

  return await Book.findOneAndUpdate({ _id: payload._id }, update);
};

const postComment = async (accesstoken: string, payload: ICommentPayload) => {
  const verifieToken = jwtHelpers.verifyToken(
    accesstoken,
    config.jwt.accessTokon_secret as Secret
  ) as JwtPayload;

  const isUserExist = await User.isUserExist(verifieToken.email);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'unauthorized, pleaase log in');
  }

  const updateOption = {
    $push: {
      reviews: {
        userId: verifieToken._id,
        comment: payload.comment,
      },
    },
  };

  const book = await Book.findOneAndUpdate(
    { _id: payload.bookId },
    updateOption,
    { new: true }
  );

  return book;
};

export const BookService = {
  getAllbooks,
  getSingleBook,
  addNewBook,
  deletBook,
  updateBook,
  postComment,
};
