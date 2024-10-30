import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import { HttpStatusResponse } from "@shared/enums/HttpStatusResponse";

class ApplicationError extends Error {
  public readonly code: number;
  public readonly status: string;
  public readonly details?: string[];

  constructor(
    code: HttpStatusCode,
    status: HttpStatusResponse,
    message: string,
    details?: string[],
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export default ApplicationError;
