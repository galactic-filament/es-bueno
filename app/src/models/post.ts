import * as SequelizeStatic from "sequelize";
import { Instance, Sequelize, STRING } from "sequelize";

import { CommentModel } from "./comment";

export type PostAttributes = {
  id?: number
  body: string
};

export interface PostInstance extends Instance<PostAttributes> {
  id: number;
}

export type PostModel = SequelizeStatic.Model<PostInstance, PostAttributes>;

export const createModel = (sequelize: Sequelize): PostModel => {
    return sequelize.define<PostInstance, PostAttributes>("post", {
        body: {type: STRING, allowNull: false}
    });
};

export const appendRelationships = (Post: PostModel, Comment: CommentModel): PostModel => {
  Post.hasMany(Comment, {foreignKey: "post_id"});

  return Post;
};
