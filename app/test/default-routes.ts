/// <reference path="../typings/index.d.ts" />
import * as supertest from "supertest";
import * as test from "tape";
import { app } from "../src/app";
import * as HTTPStatus from "http-status";

test("Homepage Should return standard greeting", (t: test.Test) => {
  const url = "/";
  supertest(app)
    .get(url)
    .end((err: Error, res: supertest.Response) => {
        t.equal(err, null, `GET ${url} err was not null`);
        t.equal(res.status, HTTPStatus.OK, `GET ${url} response status was OK`);
        t.end();
    });
});