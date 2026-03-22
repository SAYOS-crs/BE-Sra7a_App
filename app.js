import { PORT } from "./config/config.service.js";
import Bootstrap from "./src/app.controller.js";
import express from "express";
import DB_Connect from "./src/DB/connection.js";
const app = express();
app.use(express.json());
Bootstrap(app, express);
DB_Connect();
app.all("/*dummy", (req, res) => {
  res.json({ massage: "not found handler" });
});
app.listen(PORT, () => {
  console.log(`server is running successfly on ${PORT}`);
});
