import { Model, DataTypes } from "sequelize";
import sequelize_database from "../Database.js";
import Trade from "./Trade.js";

export default class TradePokemon extends Model {}

TradePokemon.init({
    id_trade: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    id_pokemon: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    login_trainer: {
        type: DataTypes.STRING(255),
        primaryKey: true
    }
}, {
    sequelize: sequelize_database,
    modelName: 'trade_pokemon',
    timestamps: false,
    freezeTableName: true
});