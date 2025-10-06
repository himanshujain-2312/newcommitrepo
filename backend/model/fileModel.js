import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";


const Item = sequelize.define('Item', {
  name: {
    type: DataTypes.STRING,
  },
  size:{
    type:DataTypes.INTEGER
  }
});

export default Item