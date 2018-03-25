import test, { TestContext } from "ava";
import * as HTTPStatus from "http-status";
import { Cookie } from "tough-cookie";
import { v4 as uuidv4 } from "uuid";

import {
  request,
  requestUser,
  requestPost,
  requestComment,
  IUserRequest,
  IPostRequest,
  IPostResponse,
  ICommentRequest,
  ICommentResponse
} from "../lib/test-helper";

const createComment = async (t: TestContext, postBody: IPostRequest, userBody: IUserRequest, commentBody: ICommentRequest): Promise<ICommentResponse> => {
  let res = await requestPost(postBody);
  t.is(res.status, HTTPStatus.CREATED);
  const post: IPostResponse = res.body;

  res = await requestUser(userBody);
  t.is(res.status, HTTPStatus.CREATED);

  res = await request.post("/login").send(userBody);
  t.is(res.status, HTTPStatus.OK);
  const cookie = (Cookie.parse(res.get("set-cookie")[0])) as Cookie;

  res = await requestComment(post.id, cookie, commentBody);
  t.is(res.status, HTTPStatus.CREATED);
  const comment: ICommentResponse = res.body;
  t.not(String(res.header["content-type"]).match(/^application\/json/), null);
  t.true("id" in comment);
  t.is(typeof comment.id, "number");

  return res.body;
};

const createTestComment = async (t: TestContext, userEmail: string, commentBody: ICommentRequest) => {
  return createComment(
    t,
    {body: "Hello, world!"},
    {email: userEmail, password: "test"},
    commentBody
  );
};

test("Comment creation endpoint Should create a new comment", async (t) => {
  let res = await requestPost({body: "Hello, world!"});
  t.is(res.status, HTTPStatus.CREATED, "Creating post");
  const post: IPostResponse = res.body;

  const userBody: IUserRequest = {email: `create-comment+${uuidv4()}@test.com`, password: "test"};
  res = await requestUser(userBody);
  t.is(res.status, HTTPStatus.CREATED, "Creating user");

  res = await request.post("/login").send(userBody);
  t.is(res.status, HTTPStatus.OK, "Logging in");
  const cookie = (Cookie.parse(res.get("set-cookie")[0])) as Cookie;

  res = await requestComment(post.id, cookie, {body: "Hello, world!"});
  t.is(res.status, HTTPStatus.CREATED, "Creating comment");
  const comment: ICommentResponse = res.body;
  t.not(String(res.header["content-type"]).match(/^application\/json/), null);
  t.true("id" in comment);
  t.is(typeof comment.id, "number");
});

test("Comment creation endpoint Should fail creating new comment on invalid post", async (t) => {
  const userBody: IUserRequest = {email: `create-invalid-comment+${uuidv4()}@test.com`, password: "test"};
  let res = await requestUser(userBody);
  t.is(res.status, HTTPStatus.CREATED, "Creating user");

  res = await request.post("/login").send(userBody);
  t.is(res.status, HTTPStatus.OK, "Logging in");
  const cookie = (Cookie.parse(res.get("set-cookie")[0])) as Cookie;

  res = await requestComment(-1, cookie, {body: "Hello, world!"});
  t.is(res.status, HTTPStatus.NOT_FOUND);
});

test("Comment creation endpoint Should get a comment", async (t) => {
  const comment = await createTestComment(
    t,
    `get-comment+${uuidv4()}@test.com`,
    {body: "Hello, world!"}
  );

  const res = await request.get(`/comment/${comment.id}`);
  t.is(res.status, HTTPStatus.OK);
  t.is(typeof res.body.post_id, "number");
  t.is(typeof res.body.user_id, "number");
});

test("Comment creation endpoint Should fail on fetching by invalid id", async (t) => {
  const res = await request.get("/comment/-1");
  t.is(res.status, HTTPStatus.NOT_FOUND);
});

test("Comment creation endpoint Should fail on updating by invalid id", async (t) => {
  const res = await request.put("/comment/-1");
  t.is(res.status, HTTPStatus.NOT_FOUND);
});

test("Comment creation endpoint Should update a comment body", async (t) => {
  const comment = await createTestComment(
    t,
    `update-body+${uuidv4()}@test.com`,
    {body: "Hello, world!"}
  );

  const newBody = "Jello, world!";
  const res = await request.put(`/comment/${comment.id}`).send({body: newBody});
  t.is(res.status, HTTPStatus.OK);
  const updatedComment: ICommentResponse = res.body;
  t.is(updatedComment.body, newBody);
  t.is(updatedComment.id, comment.id);
  t.is(updatedComment.post_id, comment.post_id);
  t.is(updatedComment.user_id, comment.user_id);
});

test("Comment creation endpoint Should fail on deleting by invalid id", async (t) => {
  const res = await request.delete("/comment/-1");
  t.is(res.status, HTTPStatus.NOT_FOUND);
});

test("Comment creation endpoint Should successfully delete", async (t) => {
  const comment = await createTestComment(
    t,
    `delete-comment+${uuidv4()}@test.com`,
    {body: "Hello, world!"}
  );

  const res = await request.delete(`/comment/${comment.id}`);
  t.is(res.status, HTTPStatus.OK);
});
