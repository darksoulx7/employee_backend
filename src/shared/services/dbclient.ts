import { config } from '@root/config';
import { Pool } from 'pg';

const pool = new Pool({
  host: config.POSTGRES_HOST,
  port: parseInt(config.POSTGRES_PORT),
  user: config.POSTGRES_USER,
  password: config.POSTGRES_PASSWORD,
  database: config.POSTGRES_DB,
});

export default pool;
