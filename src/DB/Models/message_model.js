import mongoose, { Schema } from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      require: true,
      max: [500, "max char is 500"],
      min: [3, "min char is 3"],
      trim: true,
    },
    receverId: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    collection: "message_Collection",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: true,
  },
);

const MessageModule = mongoose.model("message", messageSchema);
export default MessageModule;
