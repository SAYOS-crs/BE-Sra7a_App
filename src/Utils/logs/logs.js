import morgan from "morgan";
import fs from "node:fs";
import path from "node:path";

const logPath = path.resolve();
export const loger = (app, PathRouter, router, logType) => {
  const logStream = fs.createWriteStream(
    path.join(logPath, "./src/logs/", logType),
    { flags: "a" },
  );

  app.use(
    PathRouter,
    morgan("combined", { stream: logStream }),
    morgan("dev"),
    router,
  );
};
