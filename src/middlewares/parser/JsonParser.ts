/**
 * Enables the CORS
 *
 */

import express, { Application } from 'express';

import Log from '@utils/log/Log';
import Locals from '@providers/Locals';

import { OptionsJson } from 'body-parser';

class JsonParser {
  public mount(_express: Application): Application {
    Log.info("Booting the 'JsonParser' middleware...");

    const options: OptionsJson = {
      limit: Locals.config().maxJsonLimit
    };

    _express.use(express.json(options));

    return _express;
  }
}

export default new JsonParser();
