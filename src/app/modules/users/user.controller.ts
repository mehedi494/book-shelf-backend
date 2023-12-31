import { RequestHandler } from 'express';
import { UserService } from './user.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import config from '../../../config';

const createUser: RequestHandler = async (req, res, next) => {
  const data = req.body;
  try {
    await UserService.userCreate(data);

    sendResponse(res, {
      success: true,
      message: 'user created Successfull',
      statusCode: httpStatus.OK,
      data: 'Please log in ',
    });
  } catch (error) {
    next(error);
  }
};

const loginUser: RequestHandler = async (req, res, next) => {
  const { ...loginData } = req.body;
  try {
    const result = await UserService.loginUser(loginData);

    const { refreshToken, ...otherdata } = result;
    // set refresh token in cookie
    const cookieOption = {
      secure: config.env === 'production',
      httpOnly: true,
    };
    res.cookie('bookShelfAccess', refreshToken, cookieOption);
    sendResponse(res, {
      success: true,
      message: 'login Successfull',
      statusCode: httpStatus.OK,
      data: otherdata,
    });
  } catch (error) {
    next(error);
  }
};
const getUser: RequestHandler = async (req, res, next) => {
  const accesstoken = req?.headers?.authorization;
  try {
    const result = await UserService.getUser(accesstoken as string);

    // set refresh token in cookie

    sendResponse(res, {
      success: true,
      message: 'user retrive Successfull',
      statusCode: httpStatus.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  createUser,
  loginUser,
  getUser,
};
