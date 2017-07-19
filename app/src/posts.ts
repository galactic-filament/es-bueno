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

  router.post("/posts", json(), wrap(async (req: Request, res: Response, next: Function) => {
    try {
      const post = await Post.create({ body: req.body.body });
      res.status(HTTPStatus.CREATED).json({ id: post.id });
    } catch (err) {
      next(err);
    }
  }));
  router.get("/post/:id", wrap(async (req: Request, res: Response, next: Function) => {
    try {
      const post = await Post.findById(req.params["id"]);
      if (post === null) {
        throw new Error(`Post ${req.params["id"]} could not be found!`);
      }

      res.json(post.toJSON());
    } catch (err) {
      next(err);
    }
  }));
  router.delete("/post/:id", wrap(async (req: Request, res: Response, next: Function) => {
    try {
      const post = await Post.findById(req.params["id"]);
      if (post === null) {
        throw new Error(`Post ${req.params["id"]} could not be found!`);
      }

      await Post.destroy({ where: { id: post.id } });
      res.json({});
    } catch (err) {
      next(err);
    }
  }));
  router.put("/post/:id", json(), wrap(async (req: Request, res: Response, next: Function) => {
    try {
      let post = await Post.findById(req.params["id"]);
      if (post === null) {
        throw new Error(`Post ${req.params["id"]} could not be found!`);
      }

      await Post.update({ body: req.body.body }, { where: { id: post.id } });
      post = await Post.findById(post.id);
      if (post === null) {
        throw new Error("Post after update could not be found!");
      }

      res.json(post.toJSON());
    } catch (err) {
      next(err);
    }
  }));

  return router;
};
