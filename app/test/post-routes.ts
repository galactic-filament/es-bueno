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
      .end((err: Error, res: supertest.Response) => {
        if (err !== null) {
          t.equal(res.text, null, "ayy");
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

test("Ping endpoint Should respond to standard ping", (t: test.Test) => {
  const url = "/ping";
  supertest(app)
    .get(url)
    .expect(HTTPStatus.OK)
    .expect("Pong")
    .end((err: Error) => {
        t.equal(err, null, `GET ${url} err was not null`);
        t.end();
    });
});

test("Json reflection Should return identical Json in response as provided by request", (t: test.Test) => {
  const url = "/reflection";
  const body = { greeting: "Hello, world!" };
  supertest(app)
    .post(url)
    .send(body)
    .expect(HTTPStatus.OK)
    .end((err: Error, res: supertest.Response) => {
        t.equal(err, null, `POST ${url} err was not null`);
        t.equal(body.greeting, res.body.greeting, "Greetings in request and response match");
        t.end();
    });
});