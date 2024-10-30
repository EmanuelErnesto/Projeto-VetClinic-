import { HttpServerErrors } from "@shared/types/HttpErrors";
import { Response } from "express";

export interface IErrorStrategy {
  handle(error: HttpServerErrors, response: Response): Response;
}
