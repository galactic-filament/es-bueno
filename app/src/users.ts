import express from "express";
import { Request, Response } from "express";
import { json } from "body-parser";
import { Sequelize } from "sequelize";
import * as HTTPStatus from "http-status";
import * as winston from "winston";
import { wrap } from "async-middleware";
import * as bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import { createModel, UserInstance, withoutPassword } from "./models/user";

export const getRouter = (sequelize: Sequelize, _: winston.LoggerInstance) => {
  const router = express.Router();
  const User = createModel(sequelize);

  router.use(passport.initialize());
  router.use(passport.session());
  passport.use(new LocalStrategy(
    {usernameField: "email", passwordField: "password"},
    (email, password, done) => {
      (async () => {
        const user = await User.findOne({where: {email}});
        if (user === null) {
          done(null, false, {message: "Invalid email!"});

          return;
        }

        const isMatching = await bcrypt.compare(password, user.get("hashed_password"));
        if (isMatching === false) {
          done(null, false, {message: "Invalid password!"});

          return;
        }

        done(null, user);
      })();
    }
  ));

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
    passport.authenticate("local", (err, user: UserInstance | false, info) => {
      if (err) {
        return next(err);
      }

      if (user === false) {
        res.status(HTTPStatus.UNAUTHORIZED).send({message: info.message});

        return;
      }

      res.send(withoutPassword(user));
    })(req, res, next);
  });

  return router;
};
