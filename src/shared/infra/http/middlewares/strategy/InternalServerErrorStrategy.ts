import { HttpServerErrors } from "@shared/types/HttpErrors";
import { Response } from "express";
import { IErrorStrategy } from "./IErrorStrategy";
import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import { SOMETHING_WRONG } from "@shared/consts/HttpErrorMessageConsts";
import { HttpStatusResponse } from "@shared/enums/HttpStatusResponse";

export class InternalServerErrorStrategy implements IErrorStrategy {
  public handle(error: HttpServerErrors, response: Response): Response {
    const errorDetails = this.extractErrorDetails(error);

    return response.status(HttpStatusCode.INTERNAL_SERVER).json({
      code: HttpStatusCode.INTERNAL_SERVER,
      status: HttpStatusResponse.INTERNAL_SERVER,
      message: SOMETHING_WRONG,
      details: errorDetails,
    });
  }

  private extractErrorDetails(error: HttpServerErrors): string[] {
    if (Array.isArray(error)) return error.map((err) => err.message);
    if (error instanceof Error) return [error.message];
    if (typeof error === "string") return [error];
    return ["Unknown error occurred"];
  }
}
