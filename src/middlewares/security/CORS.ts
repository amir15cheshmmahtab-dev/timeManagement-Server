/**
 * Enables the CORS
 *
 */

import cors from 'cors';
import { Application } from 'express';

import Log from '@utils/log/Log';
import Locals from '@providers/Locals';

class CORS {
  public mount(_express: Application): Application {
    Log.info("Booting the 'CORS' middleware...");

    const options = {
      origin: [
        Locals.config().url,
        'https://*.edgerunners.org',
        'http://65.109.155.166:3060'
      ],
      credentials: true
    };

    _express.use(cors(options));

    return _express;
  }
}

export default new CORS();
