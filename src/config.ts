import dotenv from 'dotenv';
import bunyan from 'bunyan';
import path from 'path';
dotenv.config({ path: path.resolve(`${__dirname}/../.env`) });

class Config {
  public NODE_ENV: string | undefined;
  public API_URL: string | undefined;
  public POSTGRES_HOST: string | undefined;
  public POSTGRES_PORT: string;
  public POSTGRES_USER: string | undefined;
  public POSTGRES_PASSWORD: string | undefined;
  public POSTGRES_DB: string | undefined;
  public CLIENT_URL: string | undefined;

  private readonly DEFAULT_NODE_ENV = 'development';
  private readonly DEFAULT_POSTGRES_PORT = '5432';


  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || this.DEFAULT_NODE_ENV;
    this.API_URL = process.env.API_URL;
    this.POSTGRES_HOST = process.env.POSTGRES_HOST;
    this.POSTGRES_PORT = process.env.POSTGRES_PORT || this.DEFAULT_POSTGRES_PORT;
    this.POSTGRES_USER = process.env.POSTGRES_USER;
    this.POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
    this.POSTGRES_DB = process.env.POSTGRES_DB;
    this.CLIENT_URL = process.env.CLIENT_URL;
  }

  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: 'debug' });
  }

  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`Configuration ${key} is undefined`);
      }
    }
  }

}

export const config: Config = new Config();
