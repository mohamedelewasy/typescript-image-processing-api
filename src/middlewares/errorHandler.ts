import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const json = {
    status: req.statusCode ? req.statusCode : 500,
    message: err.message,
  };
  res.status(json.status).json(json);
  next();
};

export default errorHandler;
