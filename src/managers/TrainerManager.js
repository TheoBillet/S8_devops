import Trainer from "../models/Trainer.js";

export async function CreateTrainer(last_name, first_name, login, password, birthday) {
    return await Trainer.create({
        last_name: last_name,
        first_name: first_name,
        login: login,
        password: password,
        birthday: birthday
    });
}

export async function GetTrainerByLogin(login, with_password = false) {
    if (with_password)
        return await Trainer.findOne({
            where: {
                login: login
            }
        });
    return await Trainer.findOne({
        where: {
            login: login
        },
        attributes: {
            exclude: [
                'password'
            ]
        }
    });
}

export async function GetTrainerList(offset = 0, limit = 20) {
    return await Trainer.findAll({
        attributes: {
            exclude: [
                'password'
            ]
        },
        offset: offset,
        limit: limit
    });
}

export async function DeleteTrainer(login) {
    return await Trainer.destroy({
        where: {
            login: login
        },
        force: true
    });
}

export async function UpdateTrainer(trainer) {
    return await trainer.save();
}