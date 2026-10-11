import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const orderModel = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    items: { type: DataTypes.JSON, allowNull: false },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      get() {
        const value = this.getDataValue("amount");
        return value === null ? null : Number(value);
      },
    },
    address: { type: DataTypes.JSON, allowNull: false },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Order Placed",
    },
    paymentMethod: { type: DataTypes.STRING, allowNull: false },
    payment: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "orders",
  },
);

export default orderModel;