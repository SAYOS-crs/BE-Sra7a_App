import mongoose from "mongoose";
import { DataBase_URI } from "../../config/config.service.js";

export default function DB_Connect() {
  try {
    mongoose.connect(DataBase_URI);
    console.log("DataBase Connected Successfly");
  } catch (error) {
    console.log(error);
  }
}
