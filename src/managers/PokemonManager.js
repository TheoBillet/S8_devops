import { Op } from "sequelize";
import Pokemon from "../models/Pokemon.js";

export async function CreatePokemon(species, name, level, gender, shiny, login_trainer, height, weight) {
    return await Pokemon.create({
        species: species,
        name: name,
        level: level,
        gender: gender,
        height: height,
        weight: weight,
        shiny: shiny,
        login_trainer: login_trainer
    });
}

export async function GetPokemonById(id) {
    return await Pokemon.findOne({
        where: {
            id: id
        }
    });
}

export async function GetPokemonList(offset = 0, limit = 20, login_trainer, species = "", name = "", levelMin = 0, levelMax = 100, 
    gender = "", shiny, heightMin = 0, heightMax = 2147483647, weightMin = 0, weightMax = 2147483647) {
    return await Pokemon.findAll({
        where: {
            species: {
                [Op.substring]: species
            },
            name: {
                [Op.substring]: name
            },
            level: {
                [Op.gte]: levelMin,
                [Op.lte]: levelMax
            },
            gender: {
                [Op.substring]: gender
            },
            height: {
                [Op.gte]: heightMin,
                [Op.lte]: heightMax
            },
            weight: {
                [Op.gte]: weightMin,
                [Op.lte]: weightMax
            },
            shiny: shiny,
            login_trainer: login_trainer,
        },
        offset: offset,
        limit: limit
    });
}

export async function UpdatePokemon(pokemon) {
    return await pokemon.save();
}

export async function GetPokemonListWithoutShiny(offset = 0, limit = 20, login_trainer, species = "", name = "", levelMin = 0, levelMax = 100, 
    gender = "", heightMin = 0, heightMax = 2147483647, weightMin = 0, weightMax = 2147483647) {
    return await Pokemon.findAll({
        where: {
            species: {
                [Op.substring]: species
            },
            name: {
                [Op.substring]: name
            },
            level: {
                [Op.gte]: levelMin,
                [Op.lte]: levelMax
            },
            gender: {
                [Op.substring]: gender
            },
            height: {
                [Op.gte]: heightMin,
                [Op.lte]: heightMax
            },
            weight: {
                [Op.gte]: weightMin,
                [Op.lte]: weightMax
            },
            login_trainer: login_trainer,
        },
        offset: offset,
        limit: limit
    });
}

export async function DeletePokemon(id) {
    return await Pokemon.destroy({
        where: {
            id: id
        },
        force: true
    });
}
