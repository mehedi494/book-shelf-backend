import { ErrorRequestHandler } from 'express';
import { IGenericErrorMessage } from '../../interface/error';
import handleValidationError from '../../errors/handleValidationError';
import ApiError from '../../errors/apiError';
import handleCastError from '../../errors/handleCastError';
import config from '../../config';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  // eslint-disable-next-line no-console

  let statusCode = 500;
  let message = 'something went wrong';
  let errorMessages: IGenericErrorMessage[] = [];

  if (error?.name === 'ValidationError') {
    const simpledError = handleValidationError(error);
    statusCode = simpledError.statusCode;
    message = simpledError.message;
    errorMessages = simpledError.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: error?.name,
            message: error?.message,
          },
        ]
      : [];
  } else if (error?.name === 'CastError') {
    const simplefiedError = handleCastError(error);
    statusCode = simplefiedError.statusCode;
    message = simplefiedError.message;
    errorMessages = simplefiedError.errorMessages;
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: error.name,
            message: error?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== 'production' ? error?.stack : 'internal Server Error',
  });
};

export default globalErrorHandler;
