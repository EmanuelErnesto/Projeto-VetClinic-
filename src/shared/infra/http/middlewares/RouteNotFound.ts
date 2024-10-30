import { ROUTE_INVALID } from "@shared/consts/GenericErrorMessageConsts";
import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import { Request, Response } from "express";

export const RouteNotFound = (request: Request, response: Response) => {
  return response.status(HttpStatusCode.NOT_FOUND).json(ROUTE_INVALID);
};
