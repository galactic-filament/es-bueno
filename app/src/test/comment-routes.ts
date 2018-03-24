import * as assert from "assert";
import supertest from "supertest";
import * as HTTPStatus from "http-status";
import { Cookie } from "tough-cookie";
import { v4 as uuidv4 } from "uuid";

import { app } from "../lib/app";
import { requestPost, IPostRequest, IPostResponse } from "./post-routes";
import { requestUser, IUserRequest } from "./user-routes";

interface ICommentResponse {
  id: number;
  body: string;
  post_id: number;
  user_id: number;
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

const createComment = async (postBody: IPostRequest, userBody: IUserRequest, commentBody: ICommentRequest): Promise<ICommentResponse> => {
  let res = await requestPost(postBody);
  assert.equal(res.status, HTTPStatus.CREATED);
  const post: IPostResponse = res.body;

  res = await requestUser(userBody);
  assert.equal(res.status, HTTPStatus.CREATED);

  res = await request.post("/login").send(userBody);
  assert.equal(res.status, HTTPStatus.OK);
  const cookie = (Cookie.parse(res.get("set-cookie")[0])) as Cookie;

  res = await requestComment(post.id, cookie, commentBody);
  assert.equal(res.status, HTTPStatus.CREATED);
  const comment: ICommentResponse = res.body;
  assert.notEqual(String(res.header["content-type"]).match(/^application\/json/), null);
  assert.ok("id" in comment);
  assert.equal(typeof comment.id, "number");

  return res.body;
};

const createTestComment = async (userEmail: string, commentBody: ICommentRequest) => {
  return createComment(
    {body: "Hello, world!"},
    {email: userEmail, password: "test"},
    commentBody
  );
};

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

  it("Should get a comment", async () => {
    const comment = await createTestComment(
      `get-comment+${uuidv4()}@test.com`,
      {body: "Hello, world!"}
    );

    const res = await request.get(`/comment/${comment.id}`);
    assert.equal(res.status, HTTPStatus.OK);
    assert.equal(typeof res.body.post_id, "number");
    assert.equal(typeof res.body.user_id, "number");
  });
});
