import express from "express";
import { Request, Response } from "express";
import * as bodyParser from "body-parser";
import Sequelize from "sequelize";
import * as winston from "winston";
import * as HTTPStatus from "http-status";

import { router as defaultRouter } from "./default";
import { getRouter as postsRouter } from "./posts";

// express init
export const app = express();
app.use(bodyParser.json());

// logging init
const logFilepath = `${process.env["APP_LOG_DIR"]}/app.log`;
const transports = [new winston.transports.File({ filename: logFilepath })];
const logger = new winston.Logger({ transports: transports });

app.use((req: Request, _: Response, next: Function) => {
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

// route init
app.use("/", defaultRouter);
app.use("/", postsRouter(sequelize, logger));

// error logging
app.use((err: Error, req: Request, res: Response, next: Function) => {
  logger.info("Error", {
    body: JSON.stringify(req.body),
    contentType: req.header("content-type"),
    errorStack: err.stack,
    method: req.method,
    url: req.originalUrl
  });
  res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send(err.message);
  next();
});
