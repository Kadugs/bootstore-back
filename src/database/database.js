import pg from 'pg';

const { Pool } = pg;

const databaseConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const testDatabase = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 12345,
  database: 'bootstore_test',
};

const connection = new Pool(process.env.NODE_ENV === 'test' ? testDatabase : databaseConfig);

export default connection;
