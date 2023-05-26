import { Model, DataTypes } from "sequelize";
import sequelize_database from "../Database.js";

export default class Client extends Model {}

Client.init({
    client_id: {
        type: DataTypes.STRING(255),
        primaryKey: true
    },
    client_secret: {
        type: DataTypes.STRING(255)
    }
}, {
    sequelize: sequelize_database,
    modelName: 'clients',
    timestamps: false
});