/// <reference path="../typings/index.d.ts" />
import * as express from "express";
import { Request, Response } from "express";
import { ParsedAsJson } from "body-parser";
import * as Sequelize from "sequelize";
// import * as winston from "winston";
import { router as defaultRouter } from "./default";
import { getRouter as postsRouter } from "./posts";
import * as winston from "winston";

// express init
export const app = express();

// logging init
const logFilepath = `${process.cwd()}/log/app.log`;
const transports = [new winston.transports.File({ filename: logFilepath })];
const logger = new winston.Logger({ transports: transports });

app.use((req: Request & ParsedAsJson, _: Response, next: Function) => {
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
app.use("/", postsRouter(sequelize));