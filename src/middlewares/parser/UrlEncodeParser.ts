/**
 * Enables the CORS
 *
 */

import express, { Application } from 'express';

import Log from '@utils/log/Log';
import Locals from '@providers/Locals';
import { OptionsUrlencoded } from 'body-parser';

class UrlEncodeParser {
  public mount(_express: Application): Application {
    Log.info("Booting the 'UrlEncodeParser' middleware...");

    const options: OptionsUrlencoded = {
      extended: true,
      limit: Locals.config().maxUrlencodedLimit
    };
    _express.use(express.urlencoded(options));
    return _express;
  }
}

export default new UrlEncodeParser();
