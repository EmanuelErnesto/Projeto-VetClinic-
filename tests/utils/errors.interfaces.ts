import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import { HttpStatusResponse } from "@shared/enums/HttpStatusResponse";

export interface IHttpBadRequestException {
  code: HttpStatusCode.BAD_REQUEST;
  status: HttpStatusResponse.BAD_REQUEST;
  message: string;
  details?: string[];
}

export interface IHttpNotFoundException {
  code: HttpStatusCode.NOT_FOUND;
  status: HttpStatusResponse.NOT_FOUND;
  message: string;
  details?: string[];
}

export interface IHttpValidationException {
  code: HttpStatusCode.BAD_REQUEST;
  status: HttpStatusResponse.BAD_REQUEST;
  message: string;
  details: string[];
}
