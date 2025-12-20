/**
 * Register your Express middlewares
 *
 */

import { Application } from 'express';

import CORS from '@middlewares/security/CORS';
import JsonParser from '@middlewares/parser/JsonParser';

class Kernel {
  public static init(_express: Application): Application {
    _express = CORS.mount(_express);
    _express = JsonParser.mount(_express);

    return _express;
  }
}

export default Kernel;
