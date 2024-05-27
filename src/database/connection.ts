import 'dotenv/config';

import { DataSource } from 'typeorm';
import User from '@entities/usersEntity';
import Tasks from '@entities/tasksEntity';

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  SSL_ENABLED,
  SSL_REJECT_UNAUTHORIZED
} = process.env;

const sslEnabled = (SSL_ENABLED === 'true');
const sslRejectUnauthorized = (SSL_REJECT_UNAUTHORIZED !== 'true');

export const dataSource = new DataSource({
  type: 'postgres',
  host: DATABASE_HOST,
  port: Number(DATABASE_PORT),
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  synchronize: false,
  logging: ['error'],
  entities: [
    User,
    Tasks
  ],
  migrations: ['src/database/migrations/*.ts'],
  ...(sslEnabled && {
    ssl: {
      rejectUnauthorized: sslRejectUnauthorized
    }
  })
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getDataSourceRepository = async (entity: any) => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  return dataSource.manager.getRepository(entity);
};
