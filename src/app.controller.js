import morgan from "morgan";
import { AuthRouter, MessageRouter, UserRouter } from "./Modules/index.js";
import { GlobalError } from "./Utils/responses/error.respons.js";
import path from "node:path";
import { LogRecoreder } from "./Utils/logs/logs.js";
import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  // store: ... , // Redis, Memcached, etc. See below.
});

export default function Bootstrap(app, express) {
  // loger(app, "/Auth", AuthRouter, "auth.log");
  app.use(limiter);
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
