/**
 * Define App Locals & Configs
 *
 */
import { Application } from 'express';
import * as path from 'path';
import * as dotenv from 'dotenv';


class Locals {
  /**
   * Makes env configs available for your app
   * throughout the app's runtime
   */
  private static loudConfig() {
    const nodeEnv: string = process.env.NODE_ENV || 'development';

    const envFile: { [key: string]: string } = {
      "test": '../../.env.test',
      "development": '../../.env',
      "production": '../../.env'
    }

    dotenv.config({ path: path.join(__dirname, envFile[nodeEnv]) });


  }
  public static config() {
    
    this.loudConfig()
    const nodeEnv: string = process.env.NODE_ENV || 'development';

    const url = process.env.APP_URL || `http://localhost:${process.env.PORT}`;
    const port = Number(process.env.PORT) || 3000;

    const appSecret = process.env.APP_SECRET || 'This is your responsibility!';

    const maxUploadLimit = process.env.APP_MAX_UPLOAD_LIMIT || '50mb';
    const maxParameterLimit = process.env.APP_MAX_PARAMETER_LIMIT || '50mb';
    const maxJsonLimit = process.env.APP_MAX_JSON_LIMIT || '50mb';
    const maxUrlEncodedLimit = process.env.APP_MAX_URL_ENCODE_LIMIT || '50mb';


    
    const apiPrefix = process.env.API_PREFIX || 'api';


    const pgUrl = process.env.PG_URL;
    const pgHost = process.env.PG_HOST
    const pgPort = Number(process.env.PG_PORT)
    const pgUser = process.env.PG_USER
    const pgPassword = process.env.PG_PASS
    const pgDatabase = process.env.PG_DB


    const redisHost = process.env.REDIS_HOST;
    const redisPort = Number(process.env.REDIS_PORT);
    const redisPassword = process.env.REDIS_PASSWORD;
    const redisDB = Number(process.env.REDIS_DB);



    return {
      nodeEnv,
      appSecret,
      maxUploadLimit,
      maxParameterLimit,
      maxJsonLimit,
      maxUrlencodedLimit: maxUrlEncodedLimit,
      port,
      url,
      apiPrefix,
      pgUrl,
      pgHost,
      pgPort,
      pgUser,
      pgPassword,
      pgDatabase,
      redisHost,
      redisPort,
      redisPassword,
      redisDB
    };
  }

  /**
   * Injects your config to the app's locals
   */
  public static init(_express: Application): Application {
    _express.locals.app = this.config();
    return _express;
  }
}

export default Locals;
