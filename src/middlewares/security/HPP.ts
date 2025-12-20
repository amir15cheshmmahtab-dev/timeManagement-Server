/**
 * Enables the HPP to protect against HTTP Parameter Pollution attacks
 *
 */

import { Application } from 'express';
import hpp from 'hpp';

import Log from '@utils/log/Log';

class HPP {
  public mount(_express: Application): Application {
    Log.info("Booting the 'HPP' middleware...");

    const options = {};

    _express.use(hpp(options));

    return _express;
  }
}

export default new HPP();
