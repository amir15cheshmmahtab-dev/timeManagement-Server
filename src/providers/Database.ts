import { Pool } from 'pg';

import { Kysely, ParseJSONResultsPlugin, PostgresDialect } from 'kysely';
import { DB } from '@generated/prisma/kysely/types';
import Locals from './Locals';

class DataBase {
  private static _instance: DataBase;

  static getInstance(): DataBase {
    if (!this._instance) {
      this._instance = new this();
      this._instance.init();
    }
    return this._instance;
  }

  public init() {
    const dialect = new PostgresDialect({
      pool: new Pool({
        host: Locals.config().pgHost,
        port: Locals.config().pgPort,
        user: Locals.config().pgUser,
        password: Locals.config().pgPassword,
        database: Locals.config().pgDatabase,
      })
    });

    const db = new Kysely<DB>({
      dialect,
      plugins: [new ParseJSONResultsPlugin()]
    });
    
    return db;
  }

  public kysely = this.init()
  
  public async disconnect(){
		await this.kysely.destroy()
	}
}

export default DataBase;
