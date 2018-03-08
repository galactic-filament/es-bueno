import * as assert from "assert";
import supertest from "supertest";
import * as HTTPStatus from "http-status";

import { app } from "../app";

interface IUserResponse {
  id: number;
  body: string;
}

const request = supertest(app);

const createUser = async (body: any): Promise<IUserResponse> => {
  const res = await request.post("/users").send(body);
  assert.equal(res.status, HTTPStatus.CREATED);
  assert.notEqual(String(res.header["content-type"]).match(/^application\/json/), null);
  assert.ok("id" in res.body);
  assert.ok(typeof res.body.id === "number");

  return res.body;
};

describe("User creation endpoint", () => {
  const body = { email: "a@a.a" };

  it("Should create a new user", async () => {
    const res = await request.post("/users").send(body);
    assert.equal(res.status, HTTPStatus.CREATED);
    assert.notEqual(String(res.header["content-type"]).match(/^application\/json/), null);
    assert.ok("id" in res.body);
    assert.equal(typeof res.body.id, "number");
  });

  it("Should return a user", async () => {
    const user = await createUser(body);
    const res = await request.get(`/user/${user.id}`);
    assert.equal(res.status, HTTPStatus.OK);
    assert.notEqual(String(res.header["content-type"]).match(/^application\/json/), null);
    assert.equal(res.body.email, body.email);
  });

  it("Should error on fetching user by invalid id", async () => {
    const res = await request.get("/user/-1");
    assert.equal(res.status, HTTPStatus.NOT_FOUND);
  });

  it("Should delete a user", async () => {
    const user = await createUser(body);
    const res = await request.delete(`/user/${user.id}`);
    assert.equal(res.status, HTTPStatus.OK);
    assert.notEqual(String(res.header["content-type"]).match(/^application\/json/), null);
  });

  it("Should error on deleting user by invalid id", async () => {
    const res = await request.delete("/user/-1");
    assert.equal(res.status, HTTPStatus.NOT_FOUND);
  });

  it("Should update a user", async () => {
    const user = await createUser(body);
    const newBody = { email: "b@b.b" };
    const res = await request.put(`/user/${user.id}`).send(newBody);
    assert.equal(res.status, HTTPStatus.OK);
    assert.notEqual(String(res.header["content-type"]).match(/^application\/json/), null);
    assert.deepEqual(res.body.email, newBody.email);
  });

  it("Should error on updating a user by invalid id", async () => {
    const res = await request.put("/user/-1");
    assert.equal(res.status, HTTPStatus.NOT_FOUND);
  });
});
