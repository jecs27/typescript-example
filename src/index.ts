import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import * as packagesJson from '../package.json';

import { MathRoute } from './routes/mathRoute';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.disable('etag');

/*
 * Routes
 */
MathRoute(app);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port} - V${packagesJson.version}`);
  app.get('/', (_req, res) => {
    res.send('[server]: Server is running');
  });
});
