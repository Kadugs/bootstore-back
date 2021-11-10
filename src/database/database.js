import pg from 'pg';

const { Pool } = pg;

const connection = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 123456,
  database: process.env.NODE_ENV === 'test' ? 'bootstore_test' : 'bootstore',
});

export default connection;
