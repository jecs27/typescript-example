import 'dotenv/config';

import { DataSource } from 'typeorm';
import User from '@entities/usersEntity';

export const dataSource = new DataSource({
  type: 'sqlite',
  database: './data/example.sqlite',
  synchronize: false,
  logging: ['error'],
  entities: [
    User
  ],
  migrations: ['src/database/migrations/*.ts']
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getDataSourceRepository = async (entity: any) => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  return dataSource.manager.getRepository(entity);
};
