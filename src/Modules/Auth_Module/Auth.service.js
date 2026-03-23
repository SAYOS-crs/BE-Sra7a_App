import { UserModel } from "../../DB/index.js";
import { FindOne, InsertOne } from "../../Utils/repository/user.repository.js";
import { ErrorRespons } from "../../Utils/responses/error.respons.js";
import { SuccessRespons } from "../../Utils/responses/success.respons.js";
import { Decrypt, Encrypt } from "../../Utils/security/encryption.service.js";
import { Compare, Hash } from "../../Utils/security/hash.service.js";

export const Login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const result = await FindOne({ module: UserModel, filter: { Email } });
    if (!result) {
      return ErrorRespons({
        res,
        ststus: 409,
        Error: "email or password invalid",
      });
    }

    const ComparePassword = await Compare({
      data: Password,
      cipher: result.Password,
    });
    if (!ComparePassword) {
      return ErrorRespons({
        res,
        ststus: 409,
        Error: "email or password invalid",
      });
    }
    result.Phone = await Decrypt(result.Phone);
    return SuccessRespons({ res, data: result });
  } catch (error) {
    return ErrorRespons({
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
    const MatchedEmail = await FindOne({
      module: UserModel,
      filter: { Email },
      select: "-_id",
    });

    if (MatchedEmail) {
      return ErrorRespons({
        res,
        ststus: 409,
        Error: "Email already exist",
      });
    }
    data.Password = await Hash(data.Password);
    data.Phone = await Encrypt(data.Phone);

    const result = await InsertOne({ module: UserModel, data });
    SuccessRespons({ res, data: result });
  } catch (error) {
    return ErrorRespons({
      res,
      ststus: 500,
      Error: "internal server error",
      Extra: error,
    });
  }
};
