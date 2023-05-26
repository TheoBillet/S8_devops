import { Model, DataTypes } from "sequelize";
import sequelize_database from "../Database.js";

export default class Pokemon extends Model {}

Pokemon.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    species: {
        type: DataTypes.STRING(255),
    },
    name: {
        type: DataTypes.STRING(255)
    },
    level: {
        type: DataTypes.INTEGER
    },
    gender: {
        type: DataTypes.CHAR(1)
    },
    height: {
        type: DataTypes.DOUBLE
    },
    weight: {
        type: DataTypes.DOUBLE
    },
    shiny: {
        type: DataTypes.BOOLEAN
    },
    login_trainer: {
        type: DataTypes.STRING(255)
    }
}, {
    sequelize: sequelize_database,
    modelName: 'pokemons',
    timestamps: false
});