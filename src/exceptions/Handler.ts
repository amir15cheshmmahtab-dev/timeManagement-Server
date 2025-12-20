// Import necessary modules and libraries
import { HttpException } from '@exceptions/HttpException';
import { ServiceException } from '@exceptions/ServiceException';
import { AxiosError } from 'axios';

// TODO: Make this handling dynamic error types
// TODO: add prisma error handling
// export enum Methods {
//     grpc="grpc",
//     http="http"
// }
// export interface ExceptionClass {
//     [key: string]: (status: number,code:string,message: string) => HttpException | Error ;
// }

// Define the ExceptionHandler class
class ExceptionHandler {
  // private method:Methods

  // constructor(method:Methods = Methods.http){
  //     this.method = method
  // }
  // private exceptionClass:ExceptionClass = {
  //    'http': HttpException
  // }

  // Handle different types of errors
  public handler(error: unknown) {
    if (error instanceof HttpException) {
      throw new HttpException(error.status, error.code);
    } else {
      // If the error is an AxiosError, handle it using the axiosHandler method
      if (error instanceof AxiosError) {
        this.axiosHandler(error);
      } else {
        // If the error is a ServiceException, handle it using the serviceHandler method
        if (error instanceof ServiceException) {
          this.serviceHandler(error);
        } else {
          // Otherwise, throw a generic HttpException with an internal server error message
          throw new HttpException(500, 'internal_server_error');
        }
      }
    }
  }

  // TODO: check and change for this service use
  // Handle Axios errors
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private axiosHandler(error: AxiosError<any, any>) {
    if (error.response.data) {
      if (error.response.data.error) {
        const errorCode: string = error.response.data.error;
        throw new HttpException(error.response.status, errorCode);
      }
      switch (error.response.status) {
        case 401:
          throw new HttpException(401, 'unauthorized');
          break;
        case 409:
          throw new HttpException(409, 'user_exists');
          break;
        default:
          throw new HttpException(500, 'internal_server_error');
          break;
      }
    } else {
      switch (error.response.status) {
        case 401:
          throw new HttpException(401, 'unauthorized');
          break;
      }
      throw new HttpException(500, 'internal_server_error');
    }
  }

  // Handle service errors
  private serviceHandler(error: ServiceException) {
    throw new HttpException(error.status, error.code, error.data);
  }

  // Send an error with the specified status, code, and optional data
  public async sendError(
    status: number,
    code: string,
    data: object = undefined
  ) {
    throw new HttpException(status, code, data);
  }
}

// Export the ExceptionHandler class
export default ExceptionHandler;
