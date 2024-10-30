import { INVALID_REQUEST_DATA } from "@shared/consts/GenericErrorMessageConsts";
import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import { HttpStatusResponse } from "@shared/enums/HttpStatusResponse";

export class ValidationError {
  code: HttpStatusCode;
  status: HttpStatusResponse;
  message: string;
  details: string[];

  constructor(details: string[]) {
    (this.code = HttpStatusCode.BAD_REQUEST),
      (this.status = HttpStatusResponse.BAD_REQUEST);
    this.message = INVALID_REQUEST_DATA;
    this.details = details;
  }
}
