import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const productModel = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      get() {
        const value = this.getDataValue("price");
        return value === null ? null : Number(value);
      },
    },
    image: { type: DataTypes.JSON, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    subCategory: { type: DataTypes.STRING, allowNull: false },
    sizes: { type: DataTypes.JSON, allowNull: false },
    bestseller: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: "products",
  },
);

export default productModel;
