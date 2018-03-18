import * as assert from "assert";
import supertest from "supertest";
import * as HTTPStatus from "http-status";
import { Cookie } from "tough-cookie";
import { v4 as uuidv4 } from "uuid";

import { app } from "../lib/app";

interface IUserResponse {
  id: number;
  email: string;
}

interface IUserRequest {
  email: string;
  password: string;
}

const request = supertest(app);

const requestUser = (body: IUserRequest) => request.post("/users").send(body);

const createUser = async (body: IUserRequest): Promise<IUserResponse> => {
  const res = await requestUser(body);
  assert.equal(res.status, HTTPStatus.CREATED);
  assert.notEqual(String(res.header["content-type"]).match(/^application\/json/), null);
  assert.ok("id" in res.body);
  assert.ok(typeof res.body.id === "number");
  assert.equal(res.body.email, body.email);

  return res.body;
};

describe("User creation endpoint", () => {
  it("Should create a new user", async () => {
    const res = await requestUser({
      email: `create-new-user+${uuidv4()}@test.com`,
      password: "test"
    });
    assert.equal(res.status, HTTPStatus.CREATED);
    assert.notEqual(String(res.header["content-type"]).match(/^application\/json/), null);
    assert.ok("id" in res.body);
    assert.equal(typeof res.body.id, "number");
  });

  it("Should return a user", async () => {
    const user = await createUser({
      email: `return-new-user+${uuidv4()}@test.com`,
      password: "test"
    });
    const res = await request.get(`/user/${user.id}`);
    assert.equal(res.status, HTTPStatus.OK);
  });

  it("Should error on fetching user by invalid id", async () => {
    const res = await request.get("/user/-1");
    assert.equal(res.status, HTTPStatus.NOT_FOUND);
  });

  it("Should delete a user", async () => {
    const user = await createUser({
      email: `delete-user+${uuidv4()}@test.com`,
      password: "test"
    });
    const res = await request.delete(`/user/${user.id}`);
    assert.equal(res.status, HTTPStatus.OK);
    assert.notEqual(String(res.header["content-type"]).match(/^application\/json/), null);
  });

  it("Should error on deleting user by invalid id", async () => {
    const res = await request.delete("/user/-1");
    assert.equal(res.status, HTTPStatus.NOT_FOUND);
  });

  it("Should update a user", async () => {
    const user = await createUser({
      email: `update-user+${uuidv4()}@test.com`,
      password: "test"
    });
    const newBody = { email: `update-user+${uuidv4()}@test.com` };
    const res = await request.put(`/user/${user.id}`).send(newBody);
    assert.equal(res.status, HTTPStatus.OK);
    assert.equal(res.body.email, newBody.email);
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
    const user = await createUser({
      email: `invalid-password+${uuidv4()}@test.com`,
      password: "test"
    });
    const res = await request.post("/login").send({email: user.email, password: "testttttt"});
    assert.equal(res.status, HTTPStatus.UNAUTHORIZED);
    assert.deepEqual(res.body, {message: "Invalid password!"});
  });

  it("Should login when providing valid credentials", async () => {
    const user = await createUser({
      email: `valid-credentials+${uuidv4()}@test.com`,
      password: "test"
    });
    const res = await request.post("/login").send({email: user.email, password: "test"});
    assert.equal(res.status, HTTPStatus.OK);
  });

  it("Should return logged in user", async () => {
    const user = await createUser({
      email: `logged-in+${uuidv4()}@test.com`,
      password: "test"
    });
    let res = await request.post("/login").send({email: user.email, password: "test"});
    assert.equal(res.status, HTTPStatus.OK, "Log in success");

    const cookie = (Cookie.parse(res.get("set-cookie")[0])) as Cookie;

    res = await (request.get("/user").set("Cookie", cookie.toString().split(";")[0]));
    assert.equal(res.status, HTTPStatus.OK, "Current user success");
    assert.equal(res.body.email, user.email);
  });

  it("Should fail when attepmting to view currently logged in user", async () => {
    const res = await request.get("/user");
    assert.equal(res.status, HTTPStatus.UNAUTHORIZED);
  });
});
