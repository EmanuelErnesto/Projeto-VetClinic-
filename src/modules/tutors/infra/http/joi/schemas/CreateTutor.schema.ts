import Joi from "joi";

export const CreateTutorSchema = Joi.object({
  name: Joi.string().required().max(100).min(3),
  email: Joi.string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  phone: Joi.string()
    .required()
    .pattern(/^\d{11}$/),
  date_of_birth: Joi.string()
    .required()
    .pattern(
      /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/,
    ),
  zip_code: Joi.string()
    .required()
    .pattern(/^\d{8}$/),
});
