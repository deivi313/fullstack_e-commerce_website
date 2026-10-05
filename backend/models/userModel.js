import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const userModel = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { notEmpty: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cartData: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
  },
  {
    tableName: "users",
  },
);

export default userModel;
