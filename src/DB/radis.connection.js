import chalk from "chalk";
import { createClient } from "redis";
export const Radis = createClient({
  username: "default",
  password: "rFZF1sdGkzYmpOfyWeGu3p7XSWOpeJHO",
  socket: {
    host: "redis-12290.crce295.us-east-1-1.ec2.cloud.redislabs.com",
    port: 12290,
  },
});
export default async function RadisConnection() {
  try {
    await Radis.connect();
    console.log(chalk.green("Radis server is connected"));
  } catch (error) {
    console.log("Radis Server Failure", error);
  }
}
