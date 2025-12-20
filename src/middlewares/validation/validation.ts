import { plainToInstance } from 'class-transformer';
import { isEmpty, validate, ValidationError } from 'class-validator';
import { NextFunction, Request, RequestHandler } from 'express';

import { StatusCodes } from 'http-status-codes';
import { HttpException } from '@exceptions/HttpException';

const validationMiddleware = (
  type: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  value: 'body' | 'query' | 'params' = 'body',
  makeStringToJson = false,
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true,
  forbidUnknownValues = false,
  enableImplicitConversion = true
): RequestHandler => {
  return (req: Request, _res, next: NextFunction) => {
    if (makeStringToJson) {
      for (const [k, v] of Object.entries(req[value])) {
        try {
          req[value][k] = JSON.parse(v as string);
        } catch {
          req[value][k] = v;
        }
      }
    }
    validate(plainToInstance(type, req[value], { enableImplicitConversion }), {
      skipMissingProperties,
      forbidUnknownValues,
      whitelist,
      forbidNonWhitelisted
    }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const errorObject = validationErrorCreation(errors);

        next(
          new HttpException(
            StatusCodes.BAD_REQUEST,
            'validation_error',
            undefined,
            errorObject
          )
        );
      } else {
        next();
      }
    });
  };
};

const validationErrorCreation = (
  errors: ValidationError[]
) => {
  let errorObject = {};
  for (const error of errors) {
    if (!isEmpty(error.children)) {
      const childErrors = validationErrorCreation(error.children);
      errorObject = { ...errorObject, ...childErrors };
    }
    if (!isEmpty(error.constraints)) {
      const errorMessage = Object.values(error.constraints).join(', ');
      errorObject = {
        ...errorObject,
        [error.property]: errorMessage
      };
    }
  }
  return errorObject;
};

export default validationMiddleware;
