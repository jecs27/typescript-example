import express from 'express';
import { validateToken } from '@middleware/auth';
import {
  createTask,
  getTask,
  getTasks,
  updateTask,
  deleteTask
} from '@controllers/tasksController';

export const UsersRoute = (route: express.Application) => {
  route.post('/tasks', validateToken, createTask);
  route.get('/tasks', validateToken, getTasks);
  route.get('/tasks/:id', validateToken, getTask);
  route.patch('/tasks/:id', validateToken, updateTask);
  route.delete('/tasks/:id', validateToken, deleteTask);
};
