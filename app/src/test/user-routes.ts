import * as assert from "assert";
import supertest from "supertest";
import * as HTTPStatus from "http-status";
import { Cookie } from "tough-cookie";

import { app } from "../app";

interface IUserResponse {
  id: number;
  email: string;
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
  const body = { email: "a@a.a", password: "test" };

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

  it("Should fail login when providing no data", async () => {
    const res = await request.post("/login");
    assert.equal(res.status, HTTPStatus.UNAUTHORIZED);
    assert.deepEqual(res.body, {message: "Missing credentials"});
  });

  it("Should fail login when providing blank data", async () => {
    const res = await request.post("/login").send({});
    assert.equal(res.status, HTTPStatus.UNAUTHORIZED);
    assert.deepEqual(res.body, {message: "Missing credentials"});
  });

  it("Should fail login when providing non-existent email", async () => {
    const res = await request.post("/login").send({email: "a+non-existent@a.a", password: "test"});
    assert.equal(res.status, HTTPStatus.UNAUTHORIZED);
    assert.deepEqual(res.body, {message: "Invalid email!"});
  });

  it("Should fail login when providing an invalid password", async () => {
    const user = await createUser({email: "a+invalid-password@a.a", password: "test"});
    const res = await request.post("/login").send({email: user.email, password: "testttttt"});
    assert.equal(res.status, HTTPStatus.UNAUTHORIZED);
    assert.deepEqual(res.body, {message: "Invalid password!"});
  });

  it("Should login when providing valid credentials", async () => {
    const user = await createUser({email: "a+valid-credentials@a.a", password: "test"});
    const res = await request.post("/login").send({email: user.email, password: "test"});
    assert.equal(res.status, HTTPStatus.OK);
  });

  it("Should return logged in user", async () => {
    const user = await createUser({email: "a+logged-in@a.a", password: "test"});
    let res = await request.post("/login").send({email: user.email, password: "test"});
    assert.equal(res.status, HTTPStatus.OK, "Log in success");

    const cookie = Cookie.parse(res.get("set-cookie")[0]);
    if (!cookie) {
      assert.fail("Cookie was not a cookie");

      return;
    }
    
    res = await (request.get("/user").set("Cookie", cookie.toString().split(";")[0]));
    assert.equal(res.status, HTTPStatus.OK, "Current user success");
    assert.equal(res.body.email, user.email);
  });

  it("Should fail when attepmting to view currently logged in user", async () => {
    const res = await request.get("/user");
    assert.equal(res.status, HTTPStatus.UNAUTHORIZED);
  });
});
