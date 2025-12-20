import { Application, NextFunction, Request, Response } from 'express';
import Log from '@utils/log/Log';
import Locals from '@providers/Locals';
import { HttpException } from '@exceptions/HttpException';

class Handler {
  /**
   * Handles all the not found routes
   */
  public static notFoundHandler(_express: Application): Application {
    const apiPrefix = Locals.config().apiPrefix;

    _express.use('*', (req: Request, res: Response) => {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      Log.error(`Path '${req.originalUrl}' not found [IP: '${ip}']!`);
      if (req.xhr || req.originalUrl.includes(`/${apiPrefix}/`)) {
        return res.status(404).json({
          error: 'Page Not Found'
        });
      } else {
        return res.status(404).json({
          error: 'Page Not Found'
        });
      }
    });

    return _express;
  }

  /**
   * Handles your api/web routes errors/exception
   */
  public static clientErrorHandler(
    err: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    Log.error(String(err.stack));

    if (req.xhr) {
      return res.status(500).send({ error: 'Something went wrong!' });
    } else {
      return next(err);
    }
  }

  /**
   * Register your error / exception monitoring
   * tools right here ie. before "next(err)"!
   */
  public static logErrors(
    err: HttpException,
    _req: Request,
    _res: Response,
    next: NextFunction
  ) {
    Log.error(String(err.stack));

    return next(err);
  }
}

export default Handler;
