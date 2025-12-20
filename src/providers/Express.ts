/**
 * Primary file for your Clustered API Server
 *
 */

// import InitSentry from './Sentry';

// InitSentry()

import express from 'express';

import Locals from '@providers/Locals';
import ApiRoutes from '@providers/Routes';
import ExceptionHandler from '@middlewares/error/Handler';
import Kernel from '@middlewares/Kernel';
import HttpErrorMiddleware from '@middlewares/error/HttpError';
import { Server } from 'net';

class Express {
  /**
   * Create the express object
   */
  public express: express.Application;

  public listener: Server;
  /**
   * Initializes the express server
   */
  constructor() {
    this.express = express();

    this.mountDotEnv();
    this.mountMiddlewares();
    this.mountRoutes();
    this.mountErrorMiddlewares();
  }

  private mountDotEnv(): void {
    this.express = Locals.init(this.express);
  }

  /**
   * Mounts all the defined middlewares
   */
  private mountMiddlewares(): void {
    this.express = Kernel.init(this.express);
  }

  /**
   * Mounts all the defined routes
   */
  private mountRoutes(): void {
    this.express = ApiRoutes.mountApi(this.express);
    this.express = ApiRoutes.mountMcp(this.express);
  }
  //
  /**
   * Mounts all the defined Registering Exception / Error Handlers
   */
  private mountErrorMiddlewares(): void {

    this.express.use(ExceptionHandler.logErrors);
    this.express.use(ExceptionHandler.clientErrorHandler);
    this.express.use(HttpErrorMiddleware);

    this.express = ExceptionHandler.notFoundHandler(this.express);
  }

  /**
   * Starts the express server
   */
  public init() {
    const port: number = Locals.config().port;

    // Start the server on the specified port
    this.listener = this.express
      .listen(port, () => {
        return console.log(
          '\x1b[33m%s\x1b[0m',
          `Server :: Running @ 'http://localhost:${port}'`
        );
      })
      .on('error', (_error) => {
        return console.log('Error: ', _error.message);
      });
  }
}

/** Export the express module */
export default Express;
