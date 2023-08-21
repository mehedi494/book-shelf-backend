import { RequestHandler } from 'express';
import { BookService } from './book.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { booksFilterbableFields } from './book.constant';
import { paginationFields } from '../../../constants/pagination';

const getAllbooks: RequestHandler = async (req, res, next) => {
  const filter = pick(req.query, booksFilterbableFields);
  const paginationOptions = pick(req.query, paginationFields);
  try {
    const result = await BookService.getAllbooks(filter, paginationOptions);

    sendResponse(res, {
      success: true,
      message: 'retrive success',
      statusCode: httpStatus.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const getSingleBook: RequestHandler = async (req, res, next) => {
  const id = req.params.id;

  try {
    const result = await BookService.getSingleBook(id);

    sendResponse(res, {
      success: true,
      message: 'single book retrive success',
      statusCode: httpStatus.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const addNewBook: RequestHandler = async (req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(req.body);
  const payload = req.body;
  const accesstoken = req?.headers?.authorization;

  try {
    const result = await BookService.addNewBook(accesstoken as string, payload);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'New book added successfull',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const deletBook: RequestHandler = async (req, res, next) => {
  const id = req.query.id;

  const accesstoken = req?.headers?.authorization;

  try {
    const result = await BookService.deletBook(
      accesstoken as string,
      id as string
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book deleted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateBook: RequestHandler = async (req, res, next) => {
  const payload = req.body;
  const accesstoken = req?.headers?.authorization;

  try {
    const result = await BookService.updateBook(accesstoken as string, payload);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Comment added successfull',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const postComment: RequestHandler = async (req, res, next) => {
  const payload = req.body;
  const accesstoken = req?.headers?.authorization;

  try {
    const result = await BookService.postComment(
      accesstoken as string,
      payload
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const bookContoller = {
  getAllbooks,
  getSingleBook,
  addNewBook,
  updateBook,
  deletBook,
  postComment,
};
