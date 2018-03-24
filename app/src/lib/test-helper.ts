import supertest from "supertest";
import { Cookie } from "tough-cookie";

import { app } from "../lib/app";

export const request = supertest(app);

export interface IPostResponse {
  id: number;
  body: string;
}

export interface IPostRequest {
  body: string;
}

export const requestPost = (body: IPostRequest) => request.post("/posts").send(body);

export interface IUserResponse {
  id: number;
  email: string;
}

export interface IUserRequest {
  email: string;
  password: string;
}

export const requestUser = (body: IUserRequest) => request.post("/users").send(body);

export interface ICommentResponse {
  id: number;
  body: string;
  post_id: number;
  user_id: number;
}

export interface ICommentRequest {
  body: string;
}

export const requestComment = (postId: number, cookie: Cookie, body: ICommentRequest) => {
  return request
    .post(`/post/${postId}/comments`)
    .set("cookie", cookie.toString())
    .send(body);
};
