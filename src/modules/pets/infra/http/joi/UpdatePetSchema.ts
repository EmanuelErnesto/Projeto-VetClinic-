import Joi from "joi";

export const UpdatePetSchema = Joi.object({
  tutor_id: Joi.number().required().positive().min(1),
  name: Joi.string().required().max(100).min(3),
  species: Joi.string().required().min(3).max(200),
  carry: Joi.string().required().min(1).max(1),
  weight: Joi.number().required().min(1).max(200),
  date_of_birth: Joi.string()
    .required()
    .pattern(
      /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/,
    )
    .message("date_of_birth must be in format yyyy-MM-dd HH:MM"),
});
