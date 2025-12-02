import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config({
  path: join(__dirname, '..', '..', '.env'),
});

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASS || undefined,
  database: process.env.DB_NAME,
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
  synchronize: false,
  ssl:{ rejectUnauthorized: false },
});

export default dataSource;

