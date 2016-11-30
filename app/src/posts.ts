/// <reference path="../typings/index.d.ts" />
import express = require("express");
import { Request, Response } from "express";
import { json, ParsedAsJson } from "body-parser";
import * as Sequelize from "sequelize";
import * as HTTPStatus from "http-status";

interface Post {
  id?: number;
  body?: string;
}

interface PostInstance extends Sequelize.Instance<PostInstance, Post> {
  id: number;
}

export const getRouter = (sequelize: Sequelize.Connection) => {
  const router = express.Router();

  const Post = sequelize.define<PostInstance, Post>("post", {
      body: Sequelize.STRING
  });

  router.post("/posts", json(), (req: Request & ParsedAsJson, res: Response) => {
      Post.create({ body: req.body.body })
        .then((post) => res.status(HTTPStatus.CREATED).json({ id: post.id }))
        .catch((err) => res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send(err.message));
  });
  router.get("/post/:id", (req: Request, res: Response) => {
    Post.findById(req.params["id"])
      .then((post) => res.json(post.toJSON()))
      .catch((err) => res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send(err.message));
  });
  router.delete("/post/:id", (req: Request, res: Response) => {
    Post.findById(req.params["id"])
      .then((post) => Post.destroy({ where: { id: post.id } }))
      .then(() => res.json({}))
      .catch((err) => res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send(err.message));
  });
  router.put("/post/:id", json(), (req: Request & ParsedAsJson, res: Response) => {
    Post.findById(req.params["id"])
      .then((post) => Post.update({ body: req.body.body }, { where: { id: post.id } }))
      .then((result) => {
        const [, [post]] = result;
        return Post.findById(post.id);
      })
      .then((post) => res.json(post.toJSON()))
      .catch((err) => res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send(err.message));
  });

  return router;
};