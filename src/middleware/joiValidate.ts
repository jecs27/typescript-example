/* eslint-disable @typescript-eslint/no-explicit-any */
export const validates = (schema: any) => {
  return (req: any, res: any, next: any) => {
    const data = { ...req.params, ...req.query, ...req.body };
    try {
      const { error } = schema.validate(data, { abortEarly: false });
      if (error) {
        const errorMessage = error.details.map((detail: any) => detail.message).join(', ');
        return res.status(400).json({ error: errorMessage });
      }
    } catch (err) {
      return res.status(500).json({ error: 'Error de validación' });
    }
    next();
    return null;
  };
};
