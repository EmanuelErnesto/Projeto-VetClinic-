import { Response } from "express";
import { IErrorStrategy } from "./IErrorStrategy";
import ApplicationError from "@shared/errors/ApplicationError";

export class ApplicationErrorStrategy implements IErrorStrategy {
  public handle(error: ApplicationError, response: Response): Response {
    return response.status(error.code).json({
      code: error.code,
      status: error.status,
      message: error.message,
      details: error.details,
    });
  }
}
