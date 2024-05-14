import express from 'express';

import {
  multiplicationTable,
  multiplicationTableWithLimit
} from '../controllers/mathController';

export const MathRoute = (route: express.Application) => {
  route.post('/math/multiplication-table', multiplicationTable);
  route.post('/math/multiplication-table-with-limit', multiplicationTableWithLimit);

};
