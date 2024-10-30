import HttpBadRequestError from "@shared/errors/HttpBadRequestError";
import HttpInternalServerError from "@shared/errors/HttpInternalServerError";
import HttpNotFoundError from "@shared/errors/HttpNotFoundError";

export type HttpServerErrors =
  | Error
  | HttpBadRequestError
  | HttpNotFoundError
  | HttpInternalServerError
  | undefined;
