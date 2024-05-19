import { Request, Response } from 'express';

import { Priority } from '../utils/enums';
import { createTask, getTasks } from '../controllers/tasksController';
import { getDataSourceRepository } from '../database/connection';

jest.mock('@middleware/auth', () => ({
  extractUserFromToken: jest.fn().mockResolvedValue('test-user-uuid')
}));

jest.mock('@database/connection', () => ({
  getDataSourceRepository: jest.fn()
}));

let mockRepository: any;

beforeEach(() => {
  mockRepository = {
    create: jest.fn(),
    findAndCountBy: jest.fn()
  };
  (getDataSourceRepository as jest.Mock).mockReturnValue(mockRepository);
});

describe('Task Controller', () => {
  describe('createTask', () => {
    it('should create a new task', async () => {
      const mockRequest = {
        body: {
          title: 'Test Task',
          description: 'This is a test task',
          completed: false,
          priority: Priority.LOW,
          dueDate: '2023-06-01'
        }
      } as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      } as unknown as Response;

      mockRepository.create.mockResolvedValue({ id: 1, ...mockRequest.body });

      await createTask(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalledWith({
        status: 201,
        message: 'Task created',
        data: { id: 1, ...mockRequest.body }
      });
    });
  });

  describe('getTasks', () => {
    it('should return a list of tasks', async () => {
      const mockRequest = {} as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      } as unknown as Response;

      const tasks = [
        { userUuid: 'b79cb3ba-745e-5d9a-8903-4a02327a7e09', uuid: 'a5764857-ae35-34dc-8f25-a9c9e73aa898', title: 'Task 1', priority: Priority.LOW, completed: false },
        { userUuid: 'b79cb3ba-745e-5d9a-8903-4a02327a7e09', uuid: 'bd2cbad1-6ccf-48e3-bb92-bc9961bc011e', title: 'Task 2', priority: Priority.HIGH, completed: true }
      ];
      const count = tasks.length;

      mockRepository.findAndCountBy.mockResolvedValue([tasks, count]);

      await getTasks(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith({
        status: 200,
        message: 'Tasks found',
        data: { count, tasks }
      });
    });

    it('should return 404 when no tasks are found', async () => {
      const mockRequest = {} as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      } as unknown as Response;

      mockRepository.findAndCountBy.mockResolvedValue([[], 0]);

      await getTasks(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith({
        status: 404,
        message: 'Tasks not found',
        data: null
      });
    });
  });
});
