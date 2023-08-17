import httpStatus from 'http-status';

import mongoose from 'mongoose';
import { IGenericErrorMessage } from '../interface/error';
import { IGenericErrorResponse } from '../interface/common';

const handleCastError = (
  error: mongoose.Error.CastError
): IGenericErrorResponse => {
  const statusCode = httpStatus.BAD_GATEWAY;
  const errors: IGenericErrorMessage[] = [
    {
      path: error.path,
      message: `Invalid ${error.path}`,
    },
  ];
  return {
    statusCode,
    message: 'CastError',
    errorMessages: errors,
  };
};

export default handleCastError;
