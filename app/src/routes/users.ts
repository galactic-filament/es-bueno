import express from "express";
import { Request, Response } from "express";
import { json } from "body-parser";
import * as HTTPStatus from "http-status";
import { wrap } from "async-middleware";
import * as bcrypt from "bcrypt";
import passport from "passport";

import { UserModel, UserInstance, withoutPassword } from "../models/user";

export const getRouter = (User: UserModel) => {
  const router = express.Router();

  router.post("/users", json(), wrap(async (req: Request, res: Response) => {
    const email: string = req.body.email;
    const password: string = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ email, hashed_password: password });

    res.status(HTTPStatus.CREATED).json(withoutPassword(user));
  }));

  router.get("/user/:id", wrap(async (req: Request, res: Response) => {
    const user = await User.findById(req.params["id"]);
    if (user === null) {
      res.status(HTTPStatus.NOT_FOUND).send();

      return;
    }

    res.json(withoutPassword(user));
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
    const user = await User.findById(req.params["id"]);
    if (user === null) {
      res.status(HTTPStatus.NOT_FOUND).send();

      return;
    }

    user.set("email", req.body.email);
    user.save();
    res.json(withoutPassword(user));
  }));

  router.post("/login", (req, res, next) => {
    passport.authenticate("local", (_, user: UserInstance | false, info) => {
      if (user === false) {
        res.status(HTTPStatus.UNAUTHORIZED).send({message: info.message});

        return;
      }

      req.logIn(user, (_) => {
        res.status(HTTPStatus.OK);
        res.send(withoutPassword(req.user as UserInstance));
      });
    })(req, res, next);
  });

  router.get("/user", (req, res) => {
    if (typeof req.user === "undefined") {
      res.status(HTTPStatus.UNAUTHORIZED);
      res.json({});

      return;
    }

    res.json(withoutPassword(req.user as UserInstance));
  });

  return router;
};
