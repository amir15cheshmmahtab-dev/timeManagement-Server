// import { Pool } from 'pg';

// import { Kysely, ParseJSONResultsPlugin, PostgresDialect } from 'kysely';
// import { DB } from '@generated/prisma/kysely/types';
// import Locals from './Locals';

// class DataBase {
//   private static _instance: DataBase;

//   static getInstance(): DataBase {
//     if (!this._instance) {
//       this._instance = new this();
//       this._instance.init();
//     }
//     return this._instance;
//   }

//   public init() {
//     const dialect = new PostgresDialect({
//       pool: new Pool({
//         host: Locals.config().pgHost,
//         port: Locals.config().pgPort,
//         user: Locals.config().pgUser,
//         password: Locals.config().pgPassword,
//         database: Locals.config().pgDatabase,
//       })
//     });

//     const db = new Kysely<DB>({
//       dialect,
//       plugins: [new ParseJSONResultsPlugin()]
//     });
    
//     return db;
//   }

//   public kysely = this.init()
  
//   public async disconnect(){
// 		await this.kysely.destroy()
// 	}
// }

// export default DataBase;



import mongoose from 'mongoose';
import Locals from './Locals';

class DataBase {
  private static _instance: DataBase;
  public connection: typeof mongoose;

  private constructor() {
    this.connection = mongoose;
  }

  static getInstance(): DataBase {
    if (!this._instance) {
      this._instance = new this();
      this._instance.init();
    }
    return this._instance;
  }

  private async init() {
    const { mongoHost, mongoPort, mongoDatabase, mongoUser, mongoPassword } = Locals.config();

    const credentials = mongoUser && mongoPassword ? `${mongoUser}:${mongoPassword}@` : '';
    const uri = `mongodb://${credentials}${mongoHost}:${mongoPort}/${mongoDatabase}?replicaSet=rs0&readPreference=primary&directConnection=true&authSource=admin`;
    console.log("Connecting to MongoDB at:", uri);



    const maxRetries = 5;
    const retryDelay = 5000; // 5 seconds

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 30000, // 30 seconds
          connectTimeoutMS: 30000,
        });
        console.log('MongoDB connected successfully');
        return;
      } catch (err) {
        console.error(`MongoDB connection attempt ${attempt}/${maxRetries} failed:`, err);

        if (attempt === maxRetries) {
          console.error('MongoDB connection failed after all retries:', err);
          process.exit(1);
        }

        console.log(`Retrying in ${retryDelay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }

  public async disconnect() {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

export default DataBase;