import * as SequelizeStatic from "sequelize";
import { Instance, Sequelize, STRING } from "sequelize";

import { UserInstance, UserAttributes } from "./user";
import { PostInstance, PostAttributes } from "./post";

type UserModel = SequelizeStatic.Model<UserInstance, UserAttributes>;
type PostModel = SequelizeStatic.Model<PostInstance, PostAttributes>;

export type CommentAttributes = {
  id?: number
  body: string
  post_id: number
  user_id: number
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
  Comment.belongsTo(User, {foreignKey: "user_id"});
  Comment.belongsTo(Post, {foreignKey: "post_id"});

  return Comment;
};
