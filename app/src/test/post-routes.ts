import test, { TestContext } from "ava";
import * as HTTPStatus from "http-status";

import { request, IPostResponse } from "../lib/test-helper";

const createPost = async (t: TestContext, body: any): Promise<IPostResponse> => {
  const res = await request.post("/posts").send(body);
  t.is(res.status, HTTPStatus.CREATED);
  t.not(String(res.header["content-type"]).match(/^application\/json/), null);
  t.true("id" in res.body);
  t.true(typeof res.body.id === "number");

  return res.body;
};

const body = { body: "Hello, world!" };

test("Post creation endpoint Should create a new post", async (t) => {
  const res = await request.post("/posts").send(body);
  t.is(res.status, HTTPStatus.CREATED);
  t.not(String(res.header["content-type"]).match(/^application\/json/), null);
  t.true("id" in res.body);
  t.is(typeof res.body.id, "number");
});

test("Post creation endpoint Should return a post", async (t) => {
  const post = await createPost(t, body);
  const res = await request.get(`/post/${post.id}`);
  t.is(res.status, HTTPStatus.OK);
  t.not(String(res.header["content-type"]).match(/^application\/json/), null);
  t.is(res.body.body, body.body);
});

test("Post creation endpoint Should error on fetching post by invalid id", async (t) => {
  const res = await request.get("/post/-1");
  t.is(res.status, HTTPStatus.NOT_FOUND);
});

test("Post creation endpoint Should delete a post", async (t) => {
  const post = await createPost(t, body);
  const res = await request.delete(`/post/${post.id}`);
  t.is(res.status, HTTPStatus.OK);
  t.not(String(res.header["content-type"]).match(/^application\/json/), null);
});

test("Post creation endpoint Should error on deleting post by invalid id", async (t) => {
  const res = await request.delete("/post/-1");
  t.is(res.status, HTTPStatus.NOT_FOUND);
});

test("Post creation endpoint Should update a post", async (t) => {
  const post = await createPost(t, body);
  const newBody = { body: "Jello, world!" };
  const res = await request.put(`/post/${post.id}`).send(newBody);
  t.is(res.status, HTTPStatus.OK);
  t.not(String(res.header["content-type"]).match(/^application\/json/), null);
  t.deepEqual(res.body.body, newBody.body);
});

test("Post creation endpoint Should error on updating a post by invalid id", async (t) => {
  const res = await request.put("/post/-1");
  t.is(res.status, HTTPStatus.NOT_FOUND);
});
