import { UserModel } from "../../DB/index.js";
import {
  EncryptionService,
  ErrorRespons,
  HashingService,
  SuccessRespons,
  UserServices,
} from "../../Utils/index.js";

export const Login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const result = await UserServices.FindOne({
      module: UserModel,
      filter: { Email },
    });
    if (!result) {
      return ErrorRespons.ErrorRespons({
        res,
        ststus: 409,
        Error: "email or password invalid",
      });
    }

    const ComparePassword = await HashingService.Compare({
      data: Password,
      cipher: result.Password,
    });
    if (!ComparePassword) {
      return ErrorRespons.ErrorRespons({
        res,
        ststus: 409,
        Error: "email or password invalid",
      });
    }
    result.Phone = await EncryptionService.Decrypt(result.Phone);
    return SuccessRespons.SuccessRespons({ res, data: result });
  } catch (error) {
    return ErrorRespons.ErrorRespons({
      res,
      ststus: 500,
      Error: "internal server error",
      Extra: error,
    });
  }
};
// ----------------------------------------------
export const SignUp = async (req, res) => {
  const data = req.body;
  try {
    const { Email } = data;
    const MatchedEmail = await UserServices.FindOne({
      module: UserModel,
      filter: { Email },
      select: "-_id",
    });

    if (MatchedEmail) {
      return ErrorRespons.ErrorRespons({
        res,
        ststus: 409,
        Error: "Email already exist",
      });
    }
    data.Password = await HashingService.Hash(data.Password);
    data.Phone = await EncryptionService.Encrypt(data.Phone);

    const result = await UserServices.InsertOne({ module: UserModel, data });
    SuccessRespons.SuccessRespons({ res, data: result });
  } catch (error) {
    return ErrorRespons.ErrorRespons({
      res,
      ststus: 500,
      Error: "internal server error",
      Extra: error,
    });
  }
};
