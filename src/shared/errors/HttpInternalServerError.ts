import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import ApplicationError from "./ApplicationError";
import { HttpStatusResponse } from "@shared/enums/HttpStatusResponse";

class HttpInternalServerError extends ApplicationError {
  constructor(message: string, details?: string[]) {
    super(
      HttpStatusCode.INTERNAL_SERVER,
      HttpStatusResponse.INTERNAL_SERVER,
      message,
      details,
    );
  }
}

export default HttpInternalServerError;
