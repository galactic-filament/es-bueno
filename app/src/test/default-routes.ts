import test from "ava";
import supertest from "supertest";
import * as HTTPStatus from "http-status";

import { app } from "../lib/app";

const request = supertest(app);

test("Homepage Should return standard greeting", async (t) => {
  const res = await request.get("/");
  t.is(res.status, HTTPStatus.OK);
  t.is(res.text, "Hello, world!");
});

test("Ping Endpoint Should respond to standard ping", async (t) => {
  const res = await request.get("/ping");
  t.is(res.status, HTTPStatus.OK);
  t.is(res.text, "Pong");
});

test("Json reflection Should return identical Json in response as provided by request", async (t) => {
  const body = { greeting: "Hello, world!" };
  const res = await request.post("/reflection").send(body);
  t.is(res.status, HTTPStatus.OK);
  t.not(String(res.header["content-type"]).match(/^application\/json/), null);
  t.deepEqual(res.body, body);
});

test("Should return 500 error", async (t) => {
  const res = await request.get("/internal-error");
  t.is(res.status, HTTPStatus.INTERNAL_SERVER_ERROR);
});
