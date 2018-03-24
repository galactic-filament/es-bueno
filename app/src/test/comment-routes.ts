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
