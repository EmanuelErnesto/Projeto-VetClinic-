import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import ApplicationError from "./ApplicationError";
import { HttpStatusResponse } from "@shared/enums/HttpStatusResponse";

class HttpNotFoundError extends ApplicationError {
  constructor(message: string, details?: string[]) {
    super(
      HttpStatusCode.NOT_FOUND,
      HttpStatusResponse.NOT_FOUND,
      message,
      details,
    );
  }
}

export default HttpNotFoundError;
