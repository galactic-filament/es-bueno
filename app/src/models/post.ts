import * as SequelizeStatic from "sequelize";
import { Instance, Sequelize, STRING } from "sequelize";

export interface PostAttributes {
  id?: number;
  body: string;
}

export interface PostInstance extends Instance<PostAttributes> {
  id: number;
}

export const createModel = (sequelize: Sequelize): SequelizeStatic.Model<PostInstance, PostAttributes> => {
    return sequelize.define<PostInstance, PostAttributes>("post", {
        body: {type: STRING, allowNull: false}
    });
};
