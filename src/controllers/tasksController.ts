import { Request, Response } from 'express';
import Task from '@entities/tasksEntity';
import { getDataSourceRepository } from '@database/connection';
import { extractUserFromToken } from '@middleware/auth';

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, completed, priority, dueDate } = req.body;
    const userUuid = await extractUserFromToken(req);
    const taskRepository = await getDataSourceRepository(Task);
    const task = await taskRepository.create({ title, description, completed, priority, dueDate, userUuid });
    return res.status(201).send({ status: 201, message: 'Task created', data: task });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: 'An error was generated when trying to create Task.',
      data: { error }
    });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userUuid = await extractUserFromToken(req);
    const take: number = req.query?.limit ? Number(req.query.limit) : 20;
    const skip: number = req.query?.page ? ((Number(req.query.page) - 1) * take) : 0;

    const taskRepository = await getDataSourceRepository(Task);
    const [tasks, count] = await taskRepository.findAndCountBy({
      where: { userUuid },
      order: { createdAt: 'DESC' },
      take,
      skip
    });
    if (!tasks || count === 0) {
      return res.status(404).send({ status: 404, message: 'Tasks not found', data: null });
    }
    return res.status(200).send({ status: 200, message: 'Tasks found', data: { count, tasks } });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: 'An error was generated when trying to get Tasks.',
      data: { error }
    });
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const userUuid = await extractUserFromToken(req);
    const taskRepository = await getDataSourceRepository(Task);
    const task = await taskRepository.findOne({ where: { uuid: req.params.id, userUuid } });
    return res.status(200).send({ status: 200, message: 'Task data', data: task });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: 'An error was generated when trying to get Task.',
      data: { error }
    });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { title, description, completed, priority, dueDate } = req.body;
    const userUuid = await extractUserFromToken(req);
    const taskRepository = await getDataSourceRepository(Task);
    const task = await taskRepository.findOne({ where: { uuid: req.params.id, userUuid } });

    if (!task) {
      return res.status(404).send({ status: 404, message: 'Task not found', data: null });
    }

    await taskRepository.update({ title, description, completed, priority, dueDate }, { uuid: req.params.id });
    return res.status(200).send({ status: 200, message: 'Task updated', data: null });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: 'An error was generated when trying to update Task.',
      data: { error }
    });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const userUuid = await extractUserFromToken(req);
    const taskRepository = await getDataSourceRepository(Task);
    const task = await taskRepository.findOne({ where: { uuid: req.params.id, userUuid } });
    if (!task) {
      return res.status(404).send({ status: 404, message: 'Task not found', data: null });
    }
    await taskRepository.delete({ uuid: req.params.id });
    return res.status(200).send({ status: 200, message: 'Task deleted', data: null });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: 'An error was generated when trying to delete Task.',
      data: { error }
    });
  }
};
