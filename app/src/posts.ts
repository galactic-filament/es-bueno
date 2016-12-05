/// <reference path="../typings/index.d.ts" />
import express = require("express");
import { Request, Response } from "express";
import { json, ParsedAsJson } from "body-parser";
import * as Sequelize from "sequelize";
import * as HTTPStatus from "http-status";
import * as winston from "winston";

interface Post {
  id?: number;
  body?: string;
}

interface PostInstance extends Sequelize.Instance<PostInstance, Post> {
  id: number;
}

export const getRouter = (sequelize: Sequelize.Connection, _: winston.LoggerInstance) => {
  const router = express.Router();

  const Post = sequelize.define<PostInstance, Post>("post", {
      body: Sequelize.STRING
  });

  router.post("/posts", json(), (req: Request & ParsedAsJson, res: Response, next: Function) => {
      Post.create({ body: req.body.body })
        .then((post) => res.status(HTTPStatus.CREATED).json({ id: post.id }))
        .catch((err) => next(err));
  });
  router.get("/post/:id", (req: Request, res: Response, next: Function) => {
    Post.findById(req.params["id"])
      .then((post) => res.json(post.toJSON()))
      .catch((err) => next(err));
  });
  router.delete("/post/:id", (req: Request, res: Response, next: Function) => {
    Post.findById(req.params["id"])
      .then((post) => Post.destroy({ where: { id: post.id } }))
      .then(() => res.json({}))
      .catch((err) => next(err));
  });
  router.put("/post/:id", json(), (req: Request & ParsedAsJson, res: Response, next: Function) => {
    Post.findById(req.params["id"])
      .then((post) => {
        return new Promise<PostInstance>((resolve, reject) => {
          Post.update({ body: req.body.body }, { where: { id: post.id } })
            .then(() => resolve(post))
            .catch(reject);
        });
      })
      .then((post) => Post.findById(post.id))
      .then((post) => res.json(post.toJSON()))
      .catch((err) => next(err));
  });

  return router;
};