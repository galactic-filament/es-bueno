/// <reference path="../typings/index.d.ts" />
import * as supertest from "supertest";
import * as test from "tape";
import { app } from "../src/app";
import * as HTTPStatus from "http-status";

test("Homepage Should return standard greeting", (t: test.Test) => {
  const url = "/";
  supertest(app)
    .get(url)
    .expect(HTTPStatus.OK)
    .expect("Hello, world!")
    .end((err: Error) => {
        t.equal(err, null, `GET ${url} err was not null`);
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
        t.equal(body.greeting, res.body.greeting);
        t.end();
    });
});