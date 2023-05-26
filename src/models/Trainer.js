import { Model, DataTypes } from "sequelize";
import sequelize_database from "../Database.js";

export default class Trainer extends Model {}

Trainer.init({
    last_name: {
        type: DataTypes.STRING(255),
    },
    first_name: {
        type: DataTypes.STRING(255)
    },
    login: {
        type: DataTypes.STRING(255),
        primaryKey: true
    },
    password: {
        type: DataTypes.STRING(255)
    },
    birthday: {
        type: DataTypes.DATE
    }
}, {
    sequelize: sequelize_database,
    modelName: 'trainers',
    timestamps: false
});