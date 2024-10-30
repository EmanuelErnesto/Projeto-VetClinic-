import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import { ValidationError } from "@shared/errors/ValidationError";
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const RequestDataValidator = (schema: Joi.ObjectSchema) => {
  return (request: Request, response: Response, next: NextFunction) => {
    const { error } = schema.validate(request.body, {
      abortEarly: false,
      stripUnknown: true,
      errors: {
        wrap: {
          label: "",
        },
      },
    });

    if (error) {
      const details = error.details.map((detail) => detail.message);
      const validationError = new ValidationError(details);
      return response.status(HttpStatusCode.BAD_REQUEST).json(validationError);
    }

    return next();
  };
};
