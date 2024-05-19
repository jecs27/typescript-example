import 'dotenv/config';

import { DataSource } from 'typeorm';
import User from '@entities/usersEntity';
import Tasks from '@entities/tasksEntity';

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME
} = process.env;

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
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getDataSourceRepository = async (entity: any) => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  return dataSource.manager.getRepository(entity);
};
