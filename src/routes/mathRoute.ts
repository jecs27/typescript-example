import express from 'express';

import { multiplicationTable } from '../controllers/mathController';

export const MathRoute = (route: express.Application) => {
  route.post('/math/multiplication-table', multiplicationTable);
};
