import express = require("express");
import { Request, Response } from "express";
import { json } from "body-parser";
import * as Sequelize from "sequelize";
import * as HTTPStatus from "http-status";
import * as winston from "winston";
import { wrap } from "async-middleware";

export interface Post {
  id?: number;
  body?: string;
}

export interface PostInstance extends Sequelize.Instance<Post> {
  id: number;
}

export const getRouter = (sequelize: Sequelize.Sequelize, _: winston.LoggerInstance) => {
  const router = express.Router();

  const Post = sequelize.define<PostInstance, Post>("post", {
      body: Sequelize.STRING
  });

  router.post("/posts", json(), wrap(async (req: Request, res: Response) => {
    const post = await Post.create({ body: req.body.body });
    res.status(HTTPStatus.CREATED).json({ id: post.id });
  }));
  router.get("/post/:id", wrap(async (req: Request, res: Response) => {
    const post = await Post.findById(req.params["id"]);
    if (post === null) {
      res.status(HTTPStatus.NOT_FOUND).send();

      return;
    }

    res.json(post.toJSON());
  }));
  router.delete("/post/:id", wrap(async (req: Request, res: Response) => {
    const post = await Post.findById(req.params["id"]);
    if (post === null) {
      res.status(HTTPStatus.NOT_FOUND).send();

      return;
    }

    await Post.destroy({ where: { id: post.id } });
    res.json({});
  }));
  router.put("/post/:id", json(), wrap(async (req: Request, res: Response) => {
    let post = await Post.findById(req.params["id"]);
    if (post === null) {
      res.status(HTTPStatus.NOT_FOUND).send();

      return;
    }

    await Post.update({ body: req.body.body }, { where: { id: post.id } });
    post = await Post.findById(post.id);
    if (post === null) {
      res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send("Post could not be found after updating!");

      return;
    }

    res.json(post.toJSON());
  }));

  return router;
};
