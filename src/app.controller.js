import morgan from "morgan";
import { AuthRouter, MessageRouter, UserRouter } from "./Modules/index.js";
import { GlobalError } from "./Utils/responses/error.respons.js";
import path from "node:path";
import { LogRecoreder } from "./Utils/logs/logs.js";

export default function Bootstrap(app, express) {
  // loger(app, "/Auth", AuthRouter, "auth.log");

  app.use("/a", express.static(path.resolve("./src/Uploudes")));
  app.use("/Auth", LogRecoreder({ fileName: "Auth" }), AuthRouter);
  app.use("/User", LogRecoreder({ fileName: "User" }), UserRouter);
  app.use("/Message", LogRecoreder({ fileName: "Massage" }), MessageRouter);
  app.all("/*dummy", (req, res) => {
    res.json({ massage: "not found handler" });
  });
  // ===================== Global Error Handler =======================
  app.use(GlobalError);
}
