import * as assert from "assert";

import * as supertest from "supertest";
import * as HTTPStatus from "http-status";

import { app } from "../app";

interface IPostResponse {
  id: number;
  body: string;
}

const request = supertest(app);

const createPost = async (body: any): Promise<IPostResponse> => {
  const res = await request.post("/posts").send(body);
  assert.equal(res.status, HTTPStatus.CREATED);
  assert.notEqual(String(res.header["content-type"]).match(/^application\/json/), null);
  assert.ok("id" in res.body);
  assert.ok(typeof res.body.id === "number");

  return res.body;
};

describe("Post creation endpoint", () => {
  const body = { body: "Hello, world!" };

  it("Should return new post id", async () => {
    await createPost(body);
  });

  it("Should return a post", async () => {
    const post = await createPost(body);
    const res = await request.get(`/post/${post.id}`);
    assert.equal(res.status, HTTPStatus.OK);
    assert.notEqual(String(res.header["content-type"]).match(/^application\/json/), null);
    assert.equal(res.body.body, body.body);
  });

  it("Should delete a post", async () => {
    const post = await createPost(body);
    const res = await request.delete(`/post/${post.id}`);
    assert.equal(res.status, HTTPStatus.OK);
    assert.notEqual(String(res.header["content-type"]).match(/^application\/json/), null);
  });

  it("Should update a post", async () => {
    const post = await createPost(body);
    const newBody = { body: "Jello, world!" };
    const res = await request.put(`/post/${post.id}`).send(newBody);
    assert.equal(res.status, HTTPStatus.OK);
    assert.notEqual(String(res.header["content-type"]).match(/^application\/json/), null);
    assert.deepEqual(res.body.body, newBody.body);
  });
});
