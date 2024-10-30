import { ValidationError } from "@shared/errors/ValidationError";
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const RequestParamsDataValidator = (schema: Joi.ObjectSchema) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const { error } = schema.validate(request.params, {
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
      return response.status(validationError.code).json(validationError);
    }

    return next();
  };
};
