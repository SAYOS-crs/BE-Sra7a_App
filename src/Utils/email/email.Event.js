import { EventEmitter } from "node:events";
import SendEmail from "./email.service.js";

export const EmailEvent = new EventEmitter();

EmailEvent.on("SendEmail", async (data) => {
  await SendEmail({
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html,
  });
  console.log(data.to);
});
