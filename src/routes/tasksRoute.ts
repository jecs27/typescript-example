import express from 'express';
import { validateToken } from '@middleware/auth';

import {
  updateUser,
  getUserData
} from '../controllers/usersController';

export const UsersRoute = (route: express.Application) => {
  route.get('/tasks', validateToken, getUserData);
  route.get('/tasks/:id', validateToken, getUserData);
  route.post('/tasks', validateToken, updateUser);
  route.patch('/tasks/:id', validateToken, getUserData);
  route.delete('/tasks/:id', validateToken, getUserData);
};
