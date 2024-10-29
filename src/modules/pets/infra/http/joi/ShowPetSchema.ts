import Joi from "joi";

export const ShowPetSchema = Joi.object({
  id: Joi.number().required().min(1).positive(),
});
