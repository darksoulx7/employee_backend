import postgres from 'pg';
import bunyan from 'bunyan';
import pool from '@service/dbclient';
import { config } from '@root/config';

const log: bunyan = config.createLogger('db');

export default () => {
  pool
    .connect()
    .then((client) => {
      log.info('Successfully connected to PostgreSQL database');
      client.release();
    })
    .catch((err) => {
      console.log('Error', err);
      log.error(`Error connecting to PostgreSQL database: ${err}`);
      process.exit(1);
    });

  pool.on('error', (err) => {
    log.error(`Unexpected error on PostgreSQL client: ${err}`);
    process.exit(1);
  });

  return pool;
};
