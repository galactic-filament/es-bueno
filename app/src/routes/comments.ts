import express = require("express");
import { Request, Response } from "express";
import { json } from "body-parser";
import * as HTTPStatus from "http-status";
import { wrap } from "async-middleware";

import { CommentModel } from "../models/comment";

export const getRouter = (Comment: CommentModel) => {
  const router = express.Router();

  router.post("/comments", json(), wrap(async (req: Request, res: Response) => {
    const comment = await Comment.create({ body: req.body.body });

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

  router.put("/comment/:id", json(), wrap(async (req: Request, res: Response) => {
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
