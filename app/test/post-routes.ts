/// <reference path="../typings/index.d.ts" />
import * as supertest from "supertest";
import * as test from "tape";
import { app } from "../src/app";
import * as HTTPStatus from "http-status";

interface IPostResponse {
  id: number;
  body: string;
}

const createPost = (body: any, t: test.Test): Promise<IPostResponse> => {
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
        t.equal("id" in res.body, true, "Id in response body");
        t.equal(typeof res.body.id === "number", true, "Id is a number");
        resolve(res.body);
      });
  });
};

test("Post creation endpoint Should return new post's id", (t: test.Test) => {
  const body = { body: "Hello, world!" };
  createPost(body, t)
    .then(() => t.end())
    .catch((err) => {
      t.equal(err, null, `createPost() err was not null`);
      t.end();
    });
});

test("Post endpoint Should return a post", (t: test.Test) => {
  const body = { body: "Hello, world!" };
  createPost(body, t)
    .then((post) => {
      const url = `/post/${post.id}`;
      return new Promise((resolve, reject) => {
        supertest(app)
          .get(url)
          .expect(HTTPStatus.OK)
          .expect("Content-type", /^application\/json/)
          .end((err: Error, res: supertest.Response) => {
            if (err !== null) {
              return reject(err);
            }

            t.equal(body.body, res.body.body, "Request and response bodies match");
            resolve();
          });
      });
    })
    .then(() => t.end())
    .catch((err) => {
      t.equal(err, null, `err was not null`);
      t.end();
    });
});

test("Ping endpoint Should delete a post", (t: test.Test) => {
  const body = { body: "Hello, world!" };
  createPost(body, t)
    .then((post) => {
      const url = `/post/${post.id}`;
      return new Promise((resolve, reject) => {
        supertest(app)
          .delete(url)
          .expect(HTTPStatus.OK)
          .expect("Content-type", /^application\/json/)
          .end((err: Error) => {
            if (err !== null) {
              return reject(err);
            }

            resolve();
          });
      });
    })
    .then(() => t.end())
    .catch((err) => {
      t.equal(err, null, `err was not null`);
      t.end();
    });
});

test("Post endpoint Should update a post", (t: test.Test) => {
  const body = { body: "Hello, world!" };
  createPost(body, t)
    .then((post) => {
      const url = `/post/${post.id}`;
      return new Promise((resolve, reject) => {
        const newBody = { body: "Jello, world!" };
        supertest(app)
          .put(url)
          .send(newBody)
          .expect(HTTPStatus.OK)
          .expect("Content-type", /^application\/json/)
          .end((err: Error, res: supertest.Response) => {
            if (err !== null) {
              return reject(err);
            }

            t.equal(newBody.body, res.body.body, "Request and response bodies match");
            resolve();
          });
      });
    })
    .then(() => t.end())
    .catch((err) => {
      t.equal(err, null, `err was not null`);
      t.end();
    });
});