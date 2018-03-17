import { Sequelize } from "sequelize";

import {
  PostModel,
  createModel as createPostModel,
  appendRelationships as appendPostRelationships
} from "./post";
import {
  UserModel,
  createModel as createUserModel,
  appendRelationships as appendUserRelationships
} from "./user";
import {
  CommentModel,
  createModel as createCommentModel,
  appendRelationships as appendCommentRelationships
} from "./comment";

type Models = {
  Post: PostModel
  User: UserModel
  Comment: CommentModel
};

export const createModels = (sequelize: Sequelize): Models => {
  let Post = createPostModel(sequelize);
  let User = createUserModel(sequelize);
  let Comment = createCommentModel(sequelize);

  Post = appendPostRelationships(Post, Comment);
  User = appendUserRelationships(User, Comment);
  Comment = appendCommentRelationships(Comment, User, Post);

  return {
    Comment,
    Post,
    User
  };
};
