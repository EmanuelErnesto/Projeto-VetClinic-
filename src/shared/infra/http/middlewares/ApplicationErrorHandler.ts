import { HttpServerErrors } from "@shared/types/HttpErrors";
import { NextFunction, Request, Response } from "express";
import { ErrorStrategyFactory } from "./factory/ErrorStrategyFactory";

export const ApplicationErrorHandler = (
  error: HttpServerErrors,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (!error) return next();

  const factory = new ErrorStrategyFactory();
  const strategy = factory.getStrategy(error);

  return strategy?.handle(error, response);
};
