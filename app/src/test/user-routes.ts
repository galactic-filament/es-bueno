import test, { TestContext } from "ava";
import * as HTTPStatus from "http-status";
import { Cookie } from "tough-cookie";
import { v4 as uuidv4 } from "uuid";

import { request, requestUser, IUserRequest, IUserResponse } from "../lib/test-helper";

const createUser = async (t: TestContext, body: IUserRequest): Promise<IUserResponse> => {
  const res = await requestUser(body);
  t.is(res.status, HTTPStatus.CREATED);
  t.not(String(res.header["content-type"]).match(/^application\/json/), null);
  t.true("id" in res.body);
  t.true(typeof res.body.id === "number");
  t.is(res.body.email, body.email);

  return res.body;
};

test("User creation endpoint Should create a new user", async (t) => {
  const res = await requestUser({
    email: `create-new-user+${uuidv4()}@test.com`,
    password: "test"
  });
  t.is(res.status, HTTPStatus.CREATED);
  t.not(String(res.header["content-type"]).match(/^application\/json/), null);
  t.true("id" in res.body);
  t.is(typeof res.body.id, "number");
});

test("User creation endpoint Should return a user", async (t) => {
  const user = await createUser(t, {
    email: `return-new-user+${uuidv4()}@test.com`,
    password: "test"
  });
  const res = await request.get(`/user/${user.id}`);
  t.is(res.status, HTTPStatus.OK);
});

test("User creation endpoint Should error on fetching user by invalid id", async (t) => {
  const res = await request.get("/user/-1");
  t.is(res.status, HTTPStatus.NOT_FOUND);
});

test("User creation endpoint Should delete a user", async (t) => {
  const user = await createUser(t, {
    email: `delete-user+${uuidv4()}@test.com`,
    password: "test"
  });
  const res = await request.delete(`/user/${user.id}`);
  t.is(res.status, HTTPStatus.OK);
  t.not(String(res.header["content-type"]).match(/^application\/json/), null);
});

test("User creation endpoint Should error on deleting user by invalid id", async (t) => {
  const res = await request.delete("/user/-1");
  t.is(res.status, HTTPStatus.NOT_FOUND);
});

test("User creation endpoint Should update a user", async (t) => {
  const user = await createUser(t, {
    email: `update-user+${uuidv4()}@test.com`,
    password: "test"
  });
  const newBody = { email: `update-user+${uuidv4()}@test.com` };
  const res = await request.put(`/user/${user.id}`).send(newBody);
  t.is(res.status, HTTPStatus.OK);
  t.is(res.body.email, newBody.email);
});

test("User creation endpoint Should error on updating a user by invalid id", async (t) => {
  const res = await request.put("/user/-1");
  t.is(res.status, HTTPStatus.NOT_FOUND);
});

test("User creation endpoint Should fail login when providing no data", async (t) => {
  const res = await request.post("/login");
  t.is(res.status, HTTPStatus.UNAUTHORIZED);
  t.deepEqual(res.body, {message: "Missing credentials"});
});

test("User creation endpoint Should fail login when providing blank data", async (t) => {
  const res = await request.post("/login").send({});
  t.is(res.status, HTTPStatus.UNAUTHORIZED);
  t.deepEqual(res.body, {message: "Missing credentials"});
});

test("User creation endpoint Should fail login when providing non-existent email", async (t) => {
  const res = await request.post("/login").send({email: "a+non-existent@a.a", password: "test"});
  t.is(res.status, HTTPStatus.UNAUTHORIZED);
  t.deepEqual(res.body, {message: "Invalid email!"});
});

test("User creation endpoint Should fail login when providing an invalid password", async (t) => {
  const user = await createUser(t, {
    email: `invalid-password+${uuidv4()}@test.com`,
    password: "test"
  });
  const res = await request.post("/login").send({email: user.email, password: "testttttt"});
  t.is(res.status, HTTPStatus.UNAUTHORIZED);
  t.deepEqual(res.body, {message: "Invalid password!"});
});

test("User creation endpoint Should login when providing valid credentials", async (t) => {
  const user = await createUser(t, {
    email: `valid-credentials+${uuidv4()}@test.com`,
    password: "test"
  });
  const res = await request.post("/login").send({email: user.email, password: "test"});
  t.is(res.status, HTTPStatus.OK);
});

test("User creation endpoint Should return logged in user", async (t) => {
  const user = await createUser(t, {
    email: `logged-in+${uuidv4()}@test.com`,
    password: "test"
  });
  let res = await request.post("/login").send({email: user.email, password: "test"});
  t.is(res.status, HTTPStatus.OK, "Log in success");

  const cookie = (Cookie.parse(res.get("set-cookie")[0])) as Cookie;

  res = await (request.get("/user").set("Cookie", cookie.toString().split(";")[0]));
  t.is(res.status, HTTPStatus.OK, "Current user success");
  t.is(res.body.email, user.email);
});

test("User creation endpoint Should fail when attepmting to view currently logged in user", async (t) => {
  const res = await request.get("/user");
  t.is(res.status, HTTPStatus.UNAUTHORIZED);
});
