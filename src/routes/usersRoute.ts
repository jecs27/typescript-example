import express from 'express';
import { validateToken } from '@middleware/auth';

import {
  createUser,
  resetPasswordUser,
  updateUser,
  deleteUser,
  getUserData,
  login
} from '../controllers/usersController';

export const UsersRoute = (route: express.Application) => {
  route.post('/user', createUser);
  route.put('/user/:id/reset', validateToken, resetPasswordUser);
  route.patch('/user/:id', updateUser);
  route.delete('/user/:id', deleteUser);
  route.get('/user/:id', validateToken, getUserData);
  route.get('/user', validateToken, getUserData);
  route.post('/login', login);
};
