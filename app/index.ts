import { app } from "./src/app";
import * as winston from "winston";

const server = app.listen(8080, () => winston.info("Listening on 8080"));
process.on("SIGTERM", () => {
    winston.info("Caught SIGTERM, closing server");
    server.close(() => {
        winston.info("Server closed, exiting");
        process.exit(0);
    })
});