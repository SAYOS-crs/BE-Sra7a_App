import { MessageModel, UserModel } from "../../DB/index.js";
import { RollEnum } from "../../Utils/enums/Enums.js";
import { Find, FindOne, InsertOne } from "../../Utils/repository/repository.js";
import {
  BadRequstException,
  ForbiddenException,
  NotFoundException,
} from "../../Utils/responses/error.respons.js";
import { SuccessRespons } from "../../Utils/responses/success.respons.js";

// ----------------- send message ------------------\\
export const SendMessage = async (req, res) => {
  const { content } = req.body;
  const { UserId } = req.params;
  const user = await FindOne({ module: UserModel, filter: { _id: UserId } });
  if (!user) {
    throw NotFoundException({ message: "User not found " });
  }

  const result = await InsertOne({
    module: MessageModel,
    data: {
      content,
      receverId: UserId,
    },
  });
  if (!result) {
    throw BadRequstException({ message: "somthing went wrong ... " });
  }
  return SuccessRespons({
    res,
    massage: "message has been send successfly",
    data: result,
  });
};
// authed
export const SendMessage_Authed = async (req, res) => {
  const { content } = req.body;
  const { UserId } = req.params;
  const user = await FindOne({ module: UserModel, filter: { _id: UserId } });
  if (!user) {
    throw NotFoundException({ message: "User not found " });
  }
  const result = await InsertOne({
    module: MessageModel,
    data: {
      content,
      receverId: UserId,
      senderId: req.user.id,
    },
  });
  if (!result) {
    throw BadRequstException({ message: "somthing went wrong ... " });
  }
  return SuccessRespons({
    res,
    massage: "message has been send successfly",
    data: result,
  });
};
// --------------
// --------------
// -------------------- get message -------------------\\
export const GetMessages = async (req, res) => {
  const { UserId } = req.params;
  if (UserId && req.user.Roll !== RollEnum.Admin) {
    throw ForbiddenException({
      message: "you dont have permation to excute this action ! ",
    });
  }

  const messages = await Find({
    module: MessageModel,
    filter: {
      receverId: UserId ?? req.user.id,
    },
    options: {
      populate: "senderId",
    },
  });
  if (!messages) {
    throw BadRequstException({ message: "unable to get user messages" });
  }
  return SuccessRespons({ res, massage: "done", data: messages });
};
export const GetSinglerMessage = async (req, res) => {
  const { messageID } = req.params;
  const message = await FindOne({
    module: MessageModel,
    filter: {
      _id: messageID,
    },
    options: {
      populate: "senderId",
    },
  });
  if (!message) {
    throw NotFoundException({ message: "message Not Found" });
  }
  return SuccessRespons({ res, massage: "done", data: message });
};
