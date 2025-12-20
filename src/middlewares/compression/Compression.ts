/**
 * Enables the HPP to protect against HTTP Parameter Pollution attacks
 *
 */

import { Application } from 'express';
import compression from 'compression';
import Log from '@utils/log/Log';

class Compression {
  public mount(_express: Application): Application {
    Log.info("Booting the 'Compression' middleware...");

    const options = {};

    _express.use(compression(options));

    return _express;
  }
}

export default new Compression();
