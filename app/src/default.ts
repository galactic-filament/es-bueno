/// <reference path="../typings/index.d.ts" />
import express = require("express");
import { Request, Response } from "express";
import { json, ParsedAsJson } from "body-parser";

export const router = express.Router();

router.get("/", (_, res: Response) => {
  res.set("Content-type", "text/plain").send("Hello, world!");
});
router.get("/ping", (_, res: Response) => {
  res.set("Content-type", "text/plain").send("Pong");
});
router.post("/reflection", json(), (req: Request & ParsedAsJson, res: Response) => {
  res.set("Content-type", "application/json").send(req.body);
});