import * as assert from "assert";
import supertest from "supertest";
import * as HTTPStatus from "http-status";

import { app } from "../lib/app";

const request = supertest(app);

describe("Homepage", () => {
  it("Should return standard greeting", async () => {
    const res = await request.get("/");
    assert.equal(res.status, HTTPStatus.OK);
    assert.equal(res.text, "Hello, world!");
  });
});

describe("Ping endpoint", () => {
  it("Should respond to standard ping", async () => {
    const res = await request.get("/ping");
    assert.equal(res.status, HTTPStatus.OK);
    assert.equal(res.text, "Pong");
  });
});

describe("Json reflection", () => {
  it("Should return identical Json in response as provided by request", async () => {
    const body = { greeting: "Hello, world!" };
    const res = await request.post("/reflection").send(body);
    assert.equal(res.status, HTTPStatus.OK);
    assert.notEqual(String(res.header["content-type"]).match(/^application\/json/), null);
    assert.deepEqual(res.body, body);
  });
});

describe("Internal error route", () => {
  it("Should return 500 error", async () => {
    const res = await request.get("/internal-error");
    assert.equal(res.status, HTTPStatus.INTERNAL_SERVER_ERROR);
  });
});
