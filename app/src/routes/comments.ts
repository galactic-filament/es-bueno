import express = require("express");
import { Request, Response } from "express";
import * as HTTPStatus from "http-status";
import { wrap } from "async-middleware";

import { CommentModel } from "../models/comment";
import { PostModel } from "../models/post";
import { UserInstance } from "../models/user";
import { requireUser } from "../lib/session";

export const getRouter = (Comment: CommentModel, Post: PostModel) => {
  const router = express.Router();

  router.post("/post/:id/comments", requireUser, wrap(async (req: Request, res: Response) => {
    const post = await Post.findById(req.params["id"]);
    if (post === null) {
      res.status(HTTPStatus.NOT_FOUND).send();

      return;
    }

    const comment = await Comment.create({
      body: req.body.body,
      post,
      user: (req.user as UserInstance)
    });

    res.status(HTTPStatus.CREATED).json({ id: comment.id });
  }));

  router.get("/comment/:id", wrap(async (req: Request, res: Response) => {
    const comment = await Comment.findById(req.params["id"]);
    if (comment === null) {
      res.status(HTTPStatus.NOT_FOUND).send();

      return;
    }

    res.json(comment.toJSON());
  }));

  router.delete("/comment/:id", wrap(async (req: Request, res: Response) => {
    const comment = await Comment.findById(req.params["id"]);
    if (comment === null) {
      res.status(HTTPStatus.NOT_FOUND).send();

      return;
    }

    await Comment.destroy({ where: { id: comment.id } });
    res.json({});
  }));

  router.put("/comment/:id", wrap(async (req: Request, res: Response) => {
    let comment = await Comment.findById(req.params["id"]);
    if (comment === null) {
      res.status(HTTPStatus.NOT_FOUND).send();

      return;
    }

    comment.set("body", req.body.body);
    comment.save();
    res.json(comment.toJSON());
  }));

  return router;
};
