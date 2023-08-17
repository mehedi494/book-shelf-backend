import { RequestHandler } from 'express';
import { UserService } from './user.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const createUser: RequestHandler = async (req, res, next) => {
  const data = req.body;
  try {
    const result = await UserService.userCreate(data);

    sendResponse(res, {
      success: true,
      message: 'user created Successfull',
      statusCode: httpStatus.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  createUser,
};
