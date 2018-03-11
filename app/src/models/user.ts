import * as SequelizeStatic from "sequelize";
import { Instance, Sequelize, STRING } from "sequelize";

export interface UserAttributes {
  id?: number;
  email: string;
  hashed_password: string;
}

export interface UserInstance extends Instance<UserAttributes> {
  id: number;
}

export const createModel = (sequelize: Sequelize): SequelizeStatic.Model<UserInstance, UserAttributes> => {
    return sequelize.define<UserInstance, UserAttributes>("user", {
        email: {type: STRING, allowNull: false},
        hashed_password: {type: STRING, allowNull: false}
    }, {
      scopes: {
        withoutPassword: {
          attributes: { exclude: ["hashed_password"] }
        }
      }
    });
};
