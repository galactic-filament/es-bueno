import { Express } from "express";
import { Sequelize } from "sequelize";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import expressSession from "express-session";
import * as bcrypt from "bcrypt";

import { createModel, UserInstance } from "./models/user";

export const appendSessions = (app: Express, sequelize: Sequelize): Express => {
  const User = createModel(sequelize);

  passport.use(new LocalStrategy(
    {usernameField: "email", passwordField: "password"},
    (email, password, done) => {
      (async () => {
        const user = await User.findOne({where: {email}});
        if (user === null) {
          done(null, false, {message: "Invalid email!"});

          return;
        }

        const isMatching = await bcrypt.compare(password, user.get("hashed_password"));
        if (isMatching === false) {
          done(null, false, {message: "Invalid password!"});

          return;
        }

        done(null, user);
      })();
    }
  ));
  passport.serializeUser((user: UserInstance, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id: string, done) => {
    (async () => {
      const user = (await User.findById(id)) as UserInstance;
      done(null, user);
    })();
  });

  app.use(expressSession({
    secret: "es-bueno",
    saveUninitialized: false,
    resave: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  return app;
};