/// <reference path="../typings/index.d.ts" />
import * as express from "express";
import * as Sequelize from "sequelize";
// import * as winston from "winston";
import { router as defaultRouter } from "./default";
import { getRouter as postsRouter } from "./posts";

// express init
export const app = express();

// logging init
// const logFilepath = `${process.cwd()}/log/app.log`;
// const transports = [new winston.transports.File({ filename: logFilepath })];
// const logger = new winston.Logger({ transports: transports });

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