import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import ApplicationError from "./ApplicationError";
import { HttpStatusResponse } from "@shared/enums/HttpStatusResponse";

class HttpBadRequestError extends ApplicationError {
  constructor(message: string, details?: string[]) {
    super(
      HttpStatusCode.BAD_REQUEST,
      HttpStatusResponse.BAD_REQUEST,
      message,
      details,
    );
  }
}

export default HttpBadRequestError;
