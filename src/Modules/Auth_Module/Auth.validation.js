import joi from "joi";
import { GenderEnum, ProviderEnum, RollEnum } from "../../Utils/enums/Enums.js";
import generalFilds from "../../Utils/validation/General_Filds.js";

export const SignupSchema = {
  body: joi.object({
    FirstName: generalFilds.FirstName.required(),
    LastName: generalFilds.LastName.required(),
    Email: generalFilds.Email.required(),

    Password: generalFilds.Password.required(),
    ConfirmPassword: generalFilds.ConfirmPassword,

    Phone: generalFilds.Phone.required(),

    Roll: generalFilds.Roll.valid(...Object.values(RollEnum)),

    Gender: generalFilds.Gender,
    Providers: generalFilds.Providers,
    // Pictcher
    ProfilePictcher: generalFilds.ProfilePictcher,
    CoverPictchers: generalFilds.CoverPictchers,
    // Date
    ConfirmEmail: generalFilds.ConfirmEmail,
    ChangeCredentials: generalFilds.ChangeCredentials,
  }),
  headers: joi.object({}).unknown(true),
  params: joi.object({}).unknown(true),
};
export const LoginSchema = {
  body: joi.object({
    Email: generalFilds.Email.required(),
    Password: generalFilds.Password.required(),
  }),
  headers: joi.object({}).unknown(true),
  params: joi.object({}).unknown(true),
};
