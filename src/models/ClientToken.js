import { Model, DataTypes } from "sequelize";
import sequelize_database from "../Database.js";

export default class ClientsToken extends Model {}

ClientsToken.init({
    authorization_code: {
        type: DataTypes.STRING(255),
        primaryKey: true
    },
    client_id: {
        type: DataTypes.STRING(255)
    },
    expire_date: {
        type: DataTypes.DATE
    },
    id_right: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize: sequelize_database,
    modelName: 'client_token',
    timestamps: false,
    freezeTableName: true
});