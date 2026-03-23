import mongoose from "mongoose";
import { Genders, Providers } from "../../Utils/index.js";

const UserSchema = new mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: true,
      min: [3, "min length must be more then 3 chars"],
      max: [12, "max length must be lees then 12 chars"],
      trim: true,
    },
    LastName: {
      type: String,
      required: true,
      min: [3, "min length must be more then 3 chars"],
      max: [12, "max length must be lees then 12 chars"],
      trim: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Phone: String,
    // enumes
    Gender: {
      type: String,
      enum: Object.values(Genders),
      default: Genders.Male,
    },
    Providers: {
      type: Number,
      enum: Object.values(Providers),
      default: Providers.system,
    },
    // Pictcher
    ProfilePictcher: String,
    CoverPictchers: [String],
    // Date
    ConfirmEmail: Date,
    ChangeCredentials: Date,
  },
  {
    collection: "User_Collection",
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const UserModule = mongoose.models.User || mongoose.model("User", UserSchema);
export default UserModule;
