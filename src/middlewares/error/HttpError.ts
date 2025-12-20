/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import Log from '@utils/log/Log';

const HttpErrorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status: number = error.status || 500;
    const description: string = error.message 
    const code: string = error.code || 'error_code_unavailable';
    const data: any = error.data || undefined;
    const validationData = error.validationData || undefined;
    Log.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${description}`
    );
    const errorResponse = {
      code: code,
      description: description,
      data: data,
      validationData: validationData
    };
    const response =  {
      error: errorResponse,
      status: status
    };
    if (!res.headersSent) {
      res.status(response.status).json(response);
    } else {
      Log.error('uncaught error');
      Log.json(errorResponse);
    }
  } catch (error) {
    next(error);
  }
};

export default HttpErrorMiddleware;
