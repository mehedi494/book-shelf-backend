import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
// import globalErrorHandler from './app/middleware/golobalErrorHandler';
import { routers } from './app/routes';
import httpStatus from 'http-status';
import cookieParser from 'cookie-parser';

// import { error } from 'winston'
// import ApiError from './errors/ApiError'

const app: Application = express();

// cors
app.use(cors());

// parser
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Application Root Routes

app.use('/api/v1', routers);

app.get('/', (req, res) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Server are Running ',
  });
});
// Not found Route
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'routes are not found ',
    errorMessages: [
      {
        path: '',
        messsage: 'api not found',
      },
    ],
  });
  next();
});

// GlobalError handler
// app.use(globalErrorHandler);

export default app;
