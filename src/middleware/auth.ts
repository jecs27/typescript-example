import * as Crypto from 'crypto';

import * as jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { hashPassword } from '@utils/cipher';
import User from '@entities/usersEntity';

import { getDataSourceRepository } from '../database/connection';

const { SECRET_KEY: secretKey, SECRET_VALUE: secretValue } = process.env;

// Function to generate a JWT token
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateToken = async (payload: any, expiresIn: string = '1d'): Promise<string> => {
  const userRepository = await getDataSourceRepository(User);
  const userData: User = await userRepository.findOne({ where: { uuid: payload.uuid } }) as User;
  if (userData) {
    const randomAuthId = Math.floor(Math.random() * 1000);
    const bcryptId = await hashPassword(`${randomAuthId}${payload.uuid.substring(0, 8)}`);
    const token = jwt.sign({ ...payload, id: bcryptId }, secretKey, { expiresIn });
    return token;
  }
  return null;
};

// Function to validate and decode a JWT token
export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.header('Authorization')?.split(' ')[0] === 'Bearer') {
      const decoded = jwt.verify(req.header('Authorization')!.split(' ')[1], secretKey) as jwt.JwtPayload;

      if (decoded.uuid === undefined) {
        return res.status(403).send({
          status: 403,
          message: 'Invalid Token decoded.'
        });
      }

      const userRepository = await getDataSourceRepository(User);
      const userData: User = await userRepository.findOne({ where: { uuid: decoded.uuid }, withDeleted: true }) as User;
      if (userData.deletedAt) {
        return res.status(403).send({
          status: 403,
          message: 'Invalid Token.'
        });
      }

      if (decoded.exp && decoded.exp <= Date.now() / 1000) {
        return res.status(401).send({
          status: 401,
          message: 'Token Expired.'
        });
      } else {
        if (userData && userData.uuid === decoded.uuid) {
          next();
          return true;
        }
        return false;
      }
    } else {
      return res.status(403).send({
        status: 403,
        message: 'Invalid Bearer Token.'
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: 'An error was generated when trying to validate Token.',
      data: { error }
    });
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validatePermissions = (timestamp: any, Authorization: string) => {
  try {
    const hash: string = Crypto.createHmac('sha256', secretValue).update(timestamp).digest('base64');
    return hash === Authorization;
  } catch (error) {
    return false;
  }
};

export const extractUserFromToken = (req: Request) => {
  try {
    if (req.header('Authorization')?.split(' ')[0] === 'Bearer') {
      const decoded = jwt.verify(req.header('Authorization')!.split(' ')[1], secretKey) as jwt.JwtPayload;
      return decoded?.uuid;
    }
    return null;
  } catch (error) {
    return null;
  }
};
