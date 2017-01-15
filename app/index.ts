import { app } from "./src/app";
import * as winston from "winston";

const appPort = process.env["APP_PORT"];
const server = app.listen(appPort, () => winston.info(`Listening on ${appPort}`));
process.on("SIGTERM", () => {
    winston.info("Caught SIGTERM, closing server");
    server.close(() => {
        winston.info("Server closed, exiting");
        process.exit(0);
    })
});