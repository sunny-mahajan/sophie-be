import Joi from "joi";
import { PHONE_PATTERN } from "@config/appConstants";

export const invitationSignupSchema = Joi.object({
  token: Joi.string(),
  email: Joi.string(),
  fullName: Joi.string().min(1).max(255).required(),
  phone: Joi.string().pattern(PHONE_PATTERN).messages({
    "string.pattern.base": `"phone" must be a valid US phone number e.g., (123) 456-7890`,
  }),
  password: Joi.string().min(8).max(24).required(),
  streetAddress: Joi.string().min(1).max(255),
  city: Joi.string().min(1).max(255),
  state: Joi.string().min(1).max(255),
  zip: Joi.string().pattern(/(^\d{5}$)|(^\d{5}-\d{4}$)/),
  imageUrl: Joi.string(),
});
