import { AuthRouter } from "./Modules/index.js";

export default function Bootstrap(app, express) {
  app.use("/Auth", AuthRouter);
}
