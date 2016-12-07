/// <reference path="../typings/index.d.ts" />
import { test } from "ava";
import * as supertest from "supertest";
import * as HTTPStatus from "http-status";
import { app } from "../src/app";

test("Homepage Should return standard greeting", async () => {
  return new Promise<void>((resolve, reject) => {
    const url = "/";
    supertest(app)
      .get(url)
      .expect(HTTPStatus.OK)
      .expect("Hello, world!")
      .end((err: Error) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
  });
});

test("Ping endpoint Should respond to standard ping", async () => {
  return new Promise<void>((resolve, reject) => {
    const url = "/ping";
    supertest(app)
      .get(url)
      .expect(HTTPStatus.OK)
      .expect("Pong")
      .end((err: Error) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
  });
});

test("Json reflection Should return identical Json in response as provided by request", (t) => {
  return new Promise<void>((resolve, reject) => {
    const url = "/reflection";
    const body = { greeting: "Hello, world!" };
    supertest(app)
      .post(url)
      .send(body)
      .expect(HTTPStatus.OK)
      .expect("Content-type", /^application\/json/)
      .end((err: Error, res: supertest.Response) => {
        if (err) {
          return reject(err);
        }

        t.deepEqual(body, res.body, "Greetings in request and response match");
        resolve();
      });
  });
});