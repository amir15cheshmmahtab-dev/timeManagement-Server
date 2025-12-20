/**
 * Enables the CORS
 *
 */

import helmet from 'helmet';
import { Application } from 'express';

import Log from '@utils/log/Log';

class Helmet {
  public mount(_express: Application): Application {
    Log.info("Booting the 'Helmet' middleware...");

    const options = {};

    _express.use(helmet(options));

    return _express;
  }
}

export default new Helmet();
