/// <reference path="../typings/index.d.ts" />
import { test } from "ava";
import * as supertest from "supertest";
import * as HTTPStatus from "http-status";
import { app } from "../src/app";

interface IPostResponse {
  id: number;
  body: string;
}

const createPost = (body: any, t): Promise<IPostResponse> => {
  return new Promise<IPostResponse>((resolve, reject) => {
    const url = "/posts";
    supertest(app)
      .post(url)
      .send(body)
      .expect(HTTPStatus.CREATED)
      .expect("Content-type", /^application\/json/)
      .end((err: Error, res: supertest.Response) => {
        if (err !== null) {
          return reject(err);
        }
        t.is("id" in res.body, true, "Id in response body");
        t.is(typeof res.body.id === "number", true, "Id is a number");
        resolve(res.body);
      });
  });
};

test("Post creation endpoint Should return new post's id", async (t) => {
  const body = { body: "Hello, world!" };
  try {
    await createPost(body, t);
  } catch (err) {
    t.is(err.message, null, "createPost() err was not null");
  }
});

test("Post endpoint Should return a post", async (t) => {
  // creating the post
  const body = { body: "Hello, world!" };
  let post;
  try {
    post = await createPost(body, t);
  } catch (err) {
    t.is(err.message, null, "createPost() err was not null");
  }

  // fetching it
  try {
    const fetchedPost = new Promise<IPostResponse>((resolve, reject) => {
      supertest(app)
        .get(`/post/${post.id}`)
        .expect(HTTPStatus.OK)
        .expect("Content-type", /^application\/json/)
        .end((err: Error, res: supertest.Response) => {
          if (err !== null) {
            return reject(err);
          }

          t.is(body.body, res.body.body, "Request and response bodies match");
          resolve(res.body);
        });
    });
    await fetchedPost;
  } catch (err) {
    t.is(err.message, null, "Fetch post err was not null");
  }
});

test("Ping endpoint Should delete a post", async (t) => {
  // creating the post
  const body = { body: "Hello, world!" };
  let post;
  try {
    post = await createPost(body, t);
  } catch (err) {
    t.is(err.message, null, "createPost() err was not null");
  }

  // deleting it
  try {
    const deletedPost = new Promise<void>((resolve, reject) => {
      supertest(app)
        .delete(`/post/${post.id}`)
        .expect(HTTPStatus.OK)
        .expect("Content-type", /^application\/json/)
        .end((err: Error) => {
          if (err !== null) {
            return reject(err);
          }

          resolve();
        });
    });
    await deletedPost;
  } catch (err) {
    t.is(err.message, null, "Delete post err was not null");
  }
});

test("Post endpoint Should update a post", async (t) => {
  // creating the post
  const body = { body: "Hello, world!" };
  let post;
  try {
    post = await createPost(body, t);
  } catch (err) {
    t.is(err.message, null, "createPost() err was not null");
  }

  // updating it
  try {
    const updatedPost = new Promise<IPostResponse>((resolve, reject) => {
      const newBody = { body: "Jello, world!" };
      supertest(app)
        .put(`/post/${post.id}`)
        .send(newBody)
        .expect(HTTPStatus.OK)
        .expect("Content-type", /^application\/json/)
        .end((err: Error, res: supertest.Response) => {
          if (err !== null) {
            return reject(err);
          }

          t.is(newBody.body, res.body.body, "Request and response bodies match");
          resolve(res.body);
        });
    });
    await updatedPost;
  } catch (err) {
    t.is(err.message, null, "Update post err was not null");
  }
});