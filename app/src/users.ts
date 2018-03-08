import express from "express";
import { Request, Response } from "express";
import { json } from "body-parser";
import { Sequelize } from "sequelize";
import * as HTTPStatus from "http-status";
import * as winston from "winston";
import { wrap } from "async-middleware";

import { createModel } from "./models/user";

export const getRouter = (sequelize: Sequelize, _: winston.LoggerInstance) => {
  const router = express.Router();
  const User = createModel(sequelize);

  router.post("/users", json(), wrap(async (req: Request, res: Response) => {
    const email: string = req.body.email;
    const password: string = req.body.password;
    const user = await User.create({ email, password });

    res.status(HTTPStatus.CREATED).json({ id: user.id });
  }));

  router.get("/user/:id", wrap(async (req: Request, res: Response) => {
    const user = await User.findById(req.params["id"]);
    if (user === null) {
      res.status(HTTPStatus.NOT_FOUND).send();

      return;
    }

    res.json(user.toJSON());
  }));

  router.delete("/user/:id", wrap(async (req: Request, res: Response) => {
    const post = await User.findById(req.params["id"]);
    if (post === null) {
      res.status(HTTPStatus.NOT_FOUND).send();

      return;
    }

    await User.destroy({ where: { id: post.id } });
    res.json({});
  }));

  router.put("/user/:id", json(), wrap(async (req: Request, res: Response) => {
    let user = await User.findById(req.params["id"]);
    if (user === null) {
      res.status(HTTPStatus.NOT_FOUND).send();

      return;
    }

    user.set("body", req.body.body);
    user.save();
    res.json(user.toJSON());
  }));

  return router;
};
