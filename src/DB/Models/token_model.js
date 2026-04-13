import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema(
  {
    jti: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    expirIn: Date,
  },
  {
    collection: "Token_Collection",
    timestamps: true,
  },
);
TokenSchema.index("expirIn", { expireAfterSeconds: 0 });
const TokenModel = mongoose.model("Token", TokenSchema);
export default TokenModel;
