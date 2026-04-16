import { UserModel } from "../../DB/index.js";
import mongoose from "mongoose";
import {
  EncryptionService,
  HashingService,
  UserServices,
} from "../../Utils/index.js";
import { SuccessRespons } from "../../Utils/responses/success.respons.js";
import {
  BadRequstException,
  ConflictException,
  NotFoundException,
} from "../../Utils/responses/error.respons.js";
import { Compare } from "../../Utils/security/hash.service.js";
import { GeneratCredentials } from "../../Utils/security/token/token.controller.js";
import { RenewRefrshAndAccessTokens } from "../../Utils/security/token/refreshToken.service.js";
import VerifyGoogleToken from "../../Utils/providers/Google.js";
import {
  FindOne,
  FindOneAndUpdate,
  FindOneByIdAndUpdate,
  InsertOne,
} from "../../Utils/repository/repository.js";
import {
  LogoutFlags,
  ProviderEnum,
  RollEnum,
} from "../../Utils/enums/Enums.js";
import TokenModel from "../../DB/Models/token_model.js";
import {
  del,
  Hget_all,
  Hset,
  RedisKeyPrefix,
  RedisOTPprefix,
  RedisUserCredentials,
  set,
  update,
} from "../../Utils/repository/radis.repository.js";
import { ACCESS_Token_Time, OTP_TTL } from "../../../config/config.service.js";
import { GenerateOTP } from "../../Utils/security/otp/otp.service.js";
import { EmailEvent } from "../../Utils/email/email.Event.js";
import { EmailSubject } from "../../Utils/email/email.subject.js";
import OTP_Templet from "../../Utils/email/email.templet.js";
// ------------------- login end point ---------------------------
export const Login = async (req, res) => {
  const { Email, Password } = req.body;
  const user = await UserServices.FindOne({
    module: UserModel,
    filter: { Email },
  });
  // password check
  const match = await Compare({
    data: Password,
    cipher: user?.Password ? user.Password : " ",
  });
  // =======================================================
  if (!user || !match) {
    throw ConflictException({ message: "invalid Email or Password " });
  }
  // =======================================================

  const result = await GeneratCredentials(user);
  // =======================================================

  return SuccessRespons({ res, data: result });
};
// ------------------- sign up end point---------------------------
export const SignUp = async (req, res) => {
  const data = req.body;
  const { Email } = data;
  const MatchedEmail = await UserServices.FindOne({
    module: UserModel,
    filter: { Email },
  });

  if (MatchedEmail?.ConfirmEmail) {
    throw BadRequstException({ message: "Email not Verifyed" });
  }

  if (MatchedEmail) {
    throw ConflictException({
      status: 409,
      message: "Email already exist",
    });
  }

  data.Password = await HashingService.Hash(data.Password);
  data.Phone = await EncryptionService.Encrypt(data.Phone);

  //1. generate otp
  const otp = await GenerateOTP();

  //2. send otp
  EmailEvent.emit("SendEmail", {
    to: Email,
    subject: EmailSubject.ConfirmEmail,
    text: "",
    html: OTP_Templet({ Email, OTP: otp }),
  });

  //3. storge the otp in redis
  const CipherOTP = await HashingService.Hash(otp);

  await Hset({
    key: RedisOTPprefix({ Email }),
    filds: {
      CipherOTP,
      resendCount: 3,
    },
    ttl: OTP_TTL,
  });

  const result = await UserServices.InsertOne({ module: UserModel, data });

  return SuccessRespons({
    res,
    massage: "check your Email for Confirmation Code",
    data: result,
  });
};
// --------------------- Logout ------------------------------
export const Logout = async (req, res) => {
  const { flag } = req.body;
  let status;

  switch (flag) {
    case LogoutFlags.logout:
      await InsertOne({
        module: TokenModel,
        data: {
          jti: req.decoded.jti,
          userId: req.user.id,
          expirIn: req.decoded.exp * 1000,
        },
      });
      status = 201;
      break;
    case LogoutFlags.logoutFromAll:
      await FindOneByIdAndUpdate({
        module: UserModel,
        id: req.user.id,
        data: { ChangeCredentials: Date.now() },
      });
      status = 200;
      break;
  }
  return SuccessRespons({ res, status, massage: "User Loged out successfly" });
};
// ---------------------- Redis Logout ----------------------
export const Logout_Redis = async (req, res) => {
  const { flag } = req.body;
  let status;

  switch (flag) {
    case LogoutFlags.logout:
      await set({
        key: RedisKeyPrefix({ userId: req.user.id, jti: req.decoded.jti }),
        value: req.decoded.jti,
        ttl: req.decoded.exp * 1000,
      });
      status = 201;
      break;
    case LogoutFlags.logoutFromAll:
      await update({
        key: RedisUserCredentials({ userId: req.user.id }),
        value: Date.now(),
        ttl: ACCESS_Token_Time,
      });
      status = 200;
      break;
  }
  return SuccessRespons({ res, status, massage: "User Loged out successfly" });
};
// ------------------- refresh token end point --------------------
export const refreshToken = async (req, res) => {
  // distruct the token and the bearer
  const result = await RenewRefrshAndAccessTokens(req.headers.authorization);
  return SuccessRespons({
    res,
    message: "token refreshed successfly",
    data: result,
  });
};
// ------------------ log in with google ------------------
export const Google_social_provider = async (req, res) => {
  // 1. get the idToken from requst
  const { token } = req.body;
  // 2. verify google token
  const { email, email_verified, given_name, family_name, picture } =
    await VerifyGoogleToken(token);
  if (!email_verified)
    BadRequstException({ message: "cant register with unverified Email" });
  // 3. check with email - if there account with this email so log in if there no match with this email so signup
  const user = await FindOne({ module: UserModel, filter: { Email: email } });
  console.log(user);
  // if user exist Log in
  if (user) {
    const Tokens = await GeneratCredentials(user);
    return SuccessRespons({
      res,
      message: "loged in Successfly with Google Account ",
      data: Tokens,
    });
  }
  // if user dose not exist sign up
  const result = await InsertOne({
    module: UserModel,
    data: {
      FirstName: given_name,
      LastName: family_name,
      Email: email,
      ProfilePictcher: picture,
      Roll: RollEnum.User,
      Providers: ProviderEnum.google,
    },
  });
  const Tokens = await GeneratCredentials(result);
  return SuccessRespons({
    res,
    message: "signed up with Google Account Successfly ",
    data: Tokens,
  });
};
// ------------------- confirm Email --------------------
export const ConfirmEmail = async (req, res) => {
  const { otp, Email } = req.body;

  const { CipherOTP, resendCount } = await Hget_all({
    key: RedisOTPprefix({ Email }),
  });

  const commparing = await HashingService.Compare({
    data: otp,
    cipher: CipherOTP,
  });

  if (!commparing) {
    throw ConflictException({ message: "invaid otp" });
  }

  const result = await FindOneAndUpdate({
    module: UserModel,
    filter: { Email, ConfirmEmail: { $exists: true, $eq: false } },
    data: { ConfirmEmail: true, $inc: { __v: 1 } },
  });

  if (!result) {
    throw BadRequstException({
      message: "Something Went Wrong , try agin later ... ",
    });
  }
  await del({ key: RedisOTPprefix({ Email }) });
  SuccessRespons({ res, massage: "Email Confirmed Successfly" });
};
// ----------- Resend OTP (limit 3 times ) -------------
export const ResendOTP = async (req, res) => {
  // 1. destruct the email that we will resend to it
  const { Email } = req.body;
  // 2. check for user if exist and ConfirmEmail is false
  const user = await FindOne({
    module: UserModel,
    filter: { Email, ConfirmEmail: { $exists: true, $eq: false } },
  });
  if (!user) throw NotFoundException({ message: "invalid email" });
  // 3. create new OTP and hash it
  const NewOTP = GenerateOTP();
  const CipherOTP = await HashingService.Hash(NewOTP);
  // 4. check for resend trys remaining
  const data = await Hget_all({ key: RedisOTPprefix({ Email }) });
  const resendCount = Number(data.resendCount);

  // 5. replace the old otp in redis with the new hashed one if the count less then 3
  if (resendCount == 0) {
    throw BadRequstException({
      message: "you have Retched the max resend try , try after 2h",
    });
  } else {
    // 6. if resendCount less then 3 , save the new otp and incremnt the resendCount by one
    await Hset({
      key: RedisOTPprefix({ Email }),
      filds: {
        CipherOTP,
        resendCount: resendCount - 1,
      },
    });
  }
  // 7. send email with the new otp
  EmailEvent.emit("SendEmail", {
    to: Email,
    subject: EmailSubject.ConfirmEmail,
    text: "",
    html: OTP_Templet({ Email, OTP: NewOTP }),
  });
  return SuccessRespons({
    res,
    massage: `OTP Has ben Resend , you have: ${resendCount} / 3 try remaining`,
  });
};
