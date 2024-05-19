export const getTasks = async (req: Request, res: Response) => {
  try {
    const taskRepository = await getDataSourceRepository(Task);
    const tasks = await taskRepository.find();
    return res.status(200).send({ status: 200, message: 'Tasks data', data: tasks });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: 'An error was generated when trying to get Tasks.',
      data: { error }
    });
  }
};
