"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Record extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate({ User }) {
    //   // define association here
    //   this.belongsTo(User, {
    //     foreignKey: {
    //       name: "userId",
    //       allowNull: false,
    //     },
    //     onDelete: "RESTRICT",
    //     onUpdate: "RESTRICT",
    //   });
    // }
  }
  Record.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("INCOME", "EXPENSE"),
        defaultValue: "INCOME",
      },
    },
    {
      sequelize,
      modelName: "Record",
    }
  );
  return Record;
};
