import * as SequelizeStatic from "sequelize";
import { Instance, Sequelize, STRING } from "sequelize";

import { UserInstance, UserAttributes } from "./user";
import { PostInstance, PostAttributes } from "./post";

type UserModel = SequelizeStatic.Model<UserInstance, UserAttributes>;
type PostModel = SequelizeStatic.Model<PostInstance, PostAttributes>;

export type CommentAttributes = {
  id?: number
  body: string
};

export interface CommentInstance extends Instance<CommentAttributes> {
  id: number;
}

export type CommentModel = SequelizeStatic.Model<CommentInstance, CommentAttributes>;

export const createModel = (sequelize: Sequelize): CommentModel => {
  return sequelize.define<CommentInstance, CommentAttributes>("comment", {
    body: { type: STRING, allowNull: false }
  });
};

export const appendRelationships = (Comment: CommentModel, User: UserModel, Post: PostModel): CommentModel => {
  Comment.belongsTo(User);
  Comment.belongsTo(Post);

  return Comment;
};
