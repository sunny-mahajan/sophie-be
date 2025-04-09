import { sendErrorResponse } from "@utils/responseHandler";
import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((err) => err.message);
      sendErrorResponse(
        res,
        "Invalid input. Please check the form fields and try again",
        422,
        errors
      );
      return;
    }

    next();
  };
};
