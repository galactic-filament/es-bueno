import * as SequelizeStatic from "sequelize";
import { Instance, Sequelize, STRING } from "sequelize";

export interface UserAttributes {
  id?: number;
  email: string;
  password: string;
}

export interface UserInstance extends Instance<UserAttributes> {
  id: number;
}

export const createModel = (sequelize: Sequelize): SequelizeStatic.Model<UserInstance, UserAttributes> => {
    return sequelize.define<UserInstance, UserAttributes>("User", {
        email: {type: STRING, allowNull: false}
    });
};
