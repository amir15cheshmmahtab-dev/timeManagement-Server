// import { readFileSync } from 'fs';
import { Redis, RedisOptions } from 'ioredis';
// import { join } from 'path';
import Locals from './Locals';

class RedisConnection {
  private static _instance: RedisConnection;
  static getInstance(): RedisConnection {
    if (!this._instance) {
      this._instance = new this();
      this._instance.init();
    }
    return this._instance;
  }

  public Redis: Redis;
  // Initialize your database pool
  
  public init() {
    const RedisConfig: RedisOptions = {
      host: Locals.config().redisHost,
      port: Locals.config().redisPort,
      password: Locals.config().redisPassword,
      db:Locals.config().redisDB,
      maxRetriesPerRequest: null,
      
    };
    this.Redis = new Redis(RedisConfig);
    
  }
  public disconnect(){
    this.Redis.disconnect()
  }
}

export default RedisConnection;
