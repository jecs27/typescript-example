import { Request, Response } from 'express';

export const multiplicationTable = (req: Request, res: Response) => {
  try {
    const { number } = req.body;
    const table = Array.from({ length: 10 }, (_v, i) => i + 1).map((i) => i * number);
    return res.status(200).send({ status: 200, message: '', data: { table } });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: 500, message: 'Internal Server Error' });
  }
};

export const multiplicationTableWithLimit = (req: Request, res: Response) => {
  try {
    const { number, limit } = req.body;
    const table = Array.from({ length: limit }, (_v, i) => i + 1).map((i) => i * number);
    return res.status(200).send({ status: 200, message: '', data: { table } });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: 500, message: 'Internal Server Error' });
  }
};
