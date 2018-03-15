import express from "express";
import { Request, Response, NextFunction } from "express";
import * as bodyParser from "body-parser";
import Sequelize from "sequelize";
import * as winston from "winston";
import * as HTTPStatus from "http-status";

import { appendSessions } from "./session";
import { router as defaultRouter } from "./routes/default";
import { getRouter as postsRouter } from "./routes/posts";
import { getRouter as usersRouter } from "./routes/users";

// express init
export let app = express();
app.use(bodyParser.json());

// logging init
const logFilepath = `${process.env["APP_LOG_DIR"]}/app.log`;
const transports = [new winston.transports.File({ filename: logFilepath })];
const logger = new winston.Logger({ transports: transports });

// request logging
app.use((req: Request, _: Response, next: NextFunction) => {
  logger.info("Url hit", {
    body: JSON.stringify(req.body),
    contentType: req.header("content-type"),
    method: req.method,
    url: req.originalUrl
  });

  next();
});

// db init
const dbHost = process.env["DATABASE_HOST"];
const sequelize = new Sequelize("postgres", "postgres", "", <Sequelize.Options>{
  define: { timestamps: false },
  dialect: "postgres",
  host: dbHost,
  logging: false
});

// session init
app = appendSessions(app, sequelize);

// route init
app.use("/", defaultRouter);
app.use("/", postsRouter(sequelize, logger));
app.use("/", usersRouter(sequelize, logger));

// error logging
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.info("Error", {
    body: JSON.stringify(req.body),
    contentType: req.header("content-type"),
    errorStack: err.stack,
    method: req.method,
    url: req.originalUrl
  });
  console.log(err.message);
  res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send(err.message);
  next();
});
