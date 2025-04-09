import Joi from "joi";
import { PHONE_PATTERN } from "@config/appConstants";

export const invitationSignupSchema = Joi.object({
  token: Joi.string().required(),
  email: Joi.string().required(),
  firstName: Joi.string().min(1).max(255).required(),
  lastName: Joi.string().min(1).max(255).required(),
  phone: Joi.string().pattern(PHONE_PATTERN).required().messages({
    "string.pattern.base": `"phone" must be a valid US phone number e.g., (123) 456-7890`,
  }),
  password: Joi.string().min(8).max(24).required(),
  streetAddress: Joi.string().min(1).max(255).required(),
  city: Joi.string().min(1).max(255).required(),
  state: Joi.string().min(1).max(255).required(),
  zip: Joi.string()
    .pattern(/(^\d{5}$)|(^\d{5}-\d{4}$)/)
    .required(),
  imageUrl: Joi.string(),
});
