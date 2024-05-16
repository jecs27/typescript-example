import { Request, Response } from 'express';
import { generateToken, validatePermissions } from '@middleware/auth';
import { hashPassword, validatePassword } from '@utils/cipher';
import { generatePassword } from '@utils/utils';
import User from '@entities/usersEntity';

import { getDataSourceRepository } from '../database/connection';

export const login = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if ((!username && !email) || !password) {
      return res.status(400).send({ status: 400, message: 'Invalid data', data: null });
    }
    const userRepository = await getDataSourceRepository(User);
    const userData = await userRepository.findOne({ where: [
      { username },
      { email }
    ] });
    if (!userData) {
      return res.status(404).send({ status: 404, message: 'User not found', data: null });
    }

    const validPassword = await validatePassword(password, userData.password);
    if (!validPassword) {
      return res.status(401).send({ status: 401, message: 'Invalid password', data: null });
    }

    delete userData.password;
    delete userData.createdAt;
    delete userData.updatedAt;
    delete userData.deletedAt;
    const token = await generateToken({ uuid: userData.uuid });
    return res.status(200).send({ status: 200, message: 'User logged in', data: { user: userData, token } });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: 'An error was generated when trying to login.',
      data: { error }
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, username, email } = req.body;
    if (!validatePermissions(req.headers?.timestamp, req.headers?.authorization)) {
      return res.status(403).send({ status: 403, message: 'Invalid permissions', data: null });
    }
    const userRepository = await getDataSourceRepository(User);
    const userData = await userRepository.findOne({ where: [
      { username },
      { email }
    ], withDeleted: true
    });
    if (userData) {
      return res.status(409).send({ status: 409, message: 'User already exists', data: null });
    }

    const secret = generatePassword();
    const password = await hashPassword(secret);
    await userRepository.save({ name, username, password, email });

    return res.status(201).send({ status: 201, message: 'User created', data: {} });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: 'An error was generated when trying to create User.',
      data: { error }
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    if (!validatePermissions(req.headers?.timestamp, req.headers?.authorization)) {
      return res.status(403).send({ status: 403, message: 'Invalid permissions', data: null });
    }
    const userRepository = await getDataSourceRepository(User);
    const userData = await userRepository.findOne({ where: { uuid: req.params.id }, withDeleted: true });
    if (!userData || userData.deletedAt) {
      return res.status(404).send({ status: 404, message: 'User not found or deleted', data: null });
    }
    await userRepository.softDelete({ uuid: req.params.id });
    return res.status(202).send({ status: 202, message: 'User deleted', data: null });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: 'An error was generated when trying to delete User.',
      data: { error }
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    if (!validatePermissions(req.headers?.timestamp, req.headers?.authorization)) {
      return res.status(403).send({ status: 403, message: 'Invalid permissions', data: null });
    }
    const userRepository = await getDataSourceRepository(User);
    const userData = await userRepository.findOne({ where: { uuid: req.params.id } });
    if (!userData) {
      return res.status(404).send({ status: 404, message: 'User not found', data: null });
    }
    const { name, password } = req.body;
    const secretHash = await hashPassword(password);
    const userUpdatedData = await userRepository.save({ name, password: secretHash, uuid: req.params.id });
    delete userUpdatedData.password;
    delete userUpdatedData.deletedAt;
    return res.status(202).send({ status: 202, message: 'User data updated', data: userUpdatedData });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: 'An error was generated when trying to update User.',
      data: { error }
    });
  }
};

export const resetPasswordUser = async (req: Request, res: Response) => {
  try {
    const userRepository = await getDataSourceRepository(User);
    const userData = await userRepository.findOne({ where: { uuid: req.params.id } });
    if (!userData) {
      return res.status(404).send({ status: 404, message: 'User not found', data: null });
    }

    const secret = generatePassword();
    const secretHash = hashPassword(secret);

    await userRepository.update({ password: secretHash }, { uuid: req.params.id });
    return res.status(202).send({ status: 202, message: 'User password was reset', data: null });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: 'An error was generated when trying to update User.',
      data: { error }
    });
  }
};

export const getUserData = async (req: Request, res: Response) => {
  try {
    const userRepository = await getDataSourceRepository(User);
    const userData = await userRepository.findOne({ where: { uuid: req.headers?.uuid } });
    if (!userData) {
      return res.status(404).send({ status: 404, message: 'User not found', data: null });
    }
    delete userData.password;
    delete userData.createdAt;
    delete userData.updatedAt;
    delete userData.deletedAt;
    return res.status(200).send({ status: 200, message: 'User data', data: userData });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: 'An error was generated when trying to get User data.',
      data: { error }
    });
  }
};
