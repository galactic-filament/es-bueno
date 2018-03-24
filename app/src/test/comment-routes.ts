import * as assert from "assert";
import supertest from "supertest";
import * as HTTPStatus from "http-status";
import { Cookie } from "tough-cookie";
import { v4 as uuidv4 } from "uuid";

import { app } from "../lib/app";
import { requestPost, IPostResponse } from "./post-routes";
import { requestUser, IUserRequest, IUserResponse } from "./user-routes";

interface ICommentResponse {
  id: number;
  body: string;
  post: IPostResponse;
  user: IUserResponse;
}

interface ICommentRequest {
  body: string;
}

const request = supertest(app);

const requestComment = (postId: number, cookie: Cookie, body: ICommentRequest) => {
  return request
    .post(`/post/${postId}/comments`)
    .set("cookie", cookie.toString())
    .send(body);
};

// const createComment = async (post: IPostResponse, cookie: Cookie, body: any): Promise<ICommentResponse> => {
//   const res = await requestComment(post.id, cookie, body);
//   assert.equal(res.status, HTTPStatus.CREATED);
//   assert.notEqual(String(res.header["content-type"]).match(/^application\/json/), null);
//   assert.ok("id" in res.body);
//   assert.ok(typeof res.body.id === "number");

//   return res.body;
// };

describe("Comment creation endpoint", () => {
  it("Should create a new comment", async () => {
    let res = await requestPost({body: "Hello, world!"});
    assert.equal(res.status, HTTPStatus.CREATED, "Creating post");
    const post: IPostResponse = res.body;

    const userBody: IUserRequest = {email: `create-comment+${uuidv4()}@test.com`, password: "test"};
    res = await requestUser(userBody);
    assert.equal(res.status, HTTPStatus.CREATED, "Creating user");

    res = await request.post("/login").send(userBody);
    assert.equal(res.status, HTTPStatus.OK, "Logging in");
    const cookie = (Cookie.parse(res.get("set-cookie")[0])) as Cookie;

    res = await requestComment(post.id, cookie, {body: "Hello, world!"});
    assert.equal(res.status, HTTPStatus.CREATED, "Creating comment");
    const comment: ICommentResponse = res.body;
    assert.notEqual(String(res.header["content-type"]).match(/^application\/json/), null);
    assert.ok("id" in comment);
    assert.equal(typeof comment.id, "number");
  });
});
