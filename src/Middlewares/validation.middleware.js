import { BadRequstException } from "../Utils/responses/error.respons.js";

const validation = ({ schema }) => {
  return (req, res, next) => {
    const ValidationError = [];
    for (const key in schema) {
      const ValidationResult = schema[key].validate(req[key], {
        abortEarly: false,
      });

      if (ValidationResult.error) {
        ValidationError.push({
          error_path: key,
          error: ValidationResult.error.details,
        });
      }
    }

    if (ValidationError.length) {
      throw BadRequstException({
        message: "validation Error",
        extra: ValidationError,
      });
    }
    next();
  };
};
export default validation;
