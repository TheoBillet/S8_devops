import { Model, DataTypes } from "sequelize";
import sequelize_database from "../Database.js";

export default class Right extends Model {}

Right.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255)
    }
}, {
    sequelize: sequelize_database,
    modelName: 'rights',
    timestamps: false
});