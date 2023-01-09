import { validationResult } from "express-validator";
import { Request as Req, Response as Res, NextFunction as Next } from "express";

const validate = (req: Req, res: Res, next: Next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  res.status(400).json({ errors: errors.array() });
};

export default validate;
