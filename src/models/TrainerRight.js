import { Model, DataTypes } from "sequelize";
import sequelize_database from "../Database.js";
import Trainer from "./Trainer.js";
import Right from "./Right.js";

export default class TrainerRight extends Model {}

TrainerRight.init({}, {
    sequelize: sequelize_database,
    modelName: 'trainer_rights',
    timestamps: false,
});

Trainer.belongsToMany(Right, {
    through: TrainerRight,
    as: 'rights',
    foreignKey: 'login_trainer',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    targetKey: 'id',
    contraints: true
});
Right.belongsToMany(Trainer, {
    through: TrainerRight,
    as: 'trainers',
    foreignKey: 'id_right',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    targetKey: 'login',
    contraints: true
});