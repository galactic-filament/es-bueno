/// <reference path="../typings/index.d.ts" />
import express = require("express");
import { Request, Response } from "express";
import { json, ParsedAsJson } from "body-parser";
import * as Sequelize from "sequelize";
import * as HTTPStatus from "http-status";
import * as winston from "winston";
const wrap = require("express-async-wrap");

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

  router.post("/posts", json(), wrap(async (req: Request & ParsedAsJson, res: Response, next: Function) => {
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
      res.json(post.toJSON());
    } catch (err) {
      next(err);
    }
  }));
  router.delete("/post/:id", wrap(async (req: Request, res: Response, next: Function) => {
    try {
      const post = await Post.findById(req.params["id"]);
      await Post.destroy({ where: { id: post.id } });
      res.json({});
    } catch (err) {
      next(err);
    }
  }));
  router.put("/post/:id", json(), wrap(async (req: Request & ParsedAsJson, res: Response, next: Function) => {
    try {
      let post = await Post.findById(req.params["id"]);
      await Post.update({ body: req.body.body }, { where: { id: post.id } });
      post = await Post.findById(post.id);
      res.json(post.toJSON());
    } catch (err) {
      next(err);
    }
  }));

  return router;
};