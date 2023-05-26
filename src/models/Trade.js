import { Model, DataTypes } from "sequelize";
import sequelize_database from "../Database.js";

export default class Trade extends Model {}

Trade.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    login_applicant: {
        type: DataTypes.STRING(255)
    },
    login_receiver: {
        type: DataTypes.STRING(255)
    },
    state: {
        type: DataTypes.CHAR(1)
    }
}, {
    sequelize: sequelize_database,
    modelName: 'trades',
    timestamps: false
});