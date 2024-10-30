import Joi from "joi";

export const ShowTutorSchema = Joi.object({
  id: Joi.number().required().positive().min(1),
});
